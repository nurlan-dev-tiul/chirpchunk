"use server";

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import Chirp from "../models/сhirp.model"
import { connectToDB } from "../mongoose"
import Community from "../models/community.model";

interface Params {
  text: string
  author: string
  communityId: string | null
  path: string
}

// Добавляем пост
export const createChirp = async ({
  text, author, communityId, path
}: Params) => {

  try {
    connectToDB()

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdChirp = await Chirp.create({
      text,
      author,
      community: communityIdObject,

    })

    // После добавления нового поста мы должны в модели User 
    // добавить id этого поста. author - тут id пользователя который добавляет
    await User.findByIdAndUpdate(author, {
      $push: { chirps: createdChirp._id }
    })

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { chirps: createdChirp._id },
      });
    }
    revalidatePath(path)

  } catch (error) {
    throw new Error("Failed to create Chirp")
  }
}

// Получаем все посты
export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  // $in - для выборки из БД, Это вернет все документы, у которых поле parentId
  // null или undefind
  const postsQuery = Chirp.find({parentId: {$in: [null, undefined]}})
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author", // поле author
      model: User, // модель User
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // путь к полю children
      populate: {
        path: "author", // поле author из модели User
        model: User,
        // Выбираем только эти поля на выход
        select: "_id name parentId image",
      },
    });

    // Получаем количество постов
    const totalPostsCount = await Chirp.countDocuments({
      parentId: { $in: [null, undefined] },
    }); 

    // Выполняем запрос на БД postsQuery = имеет метод find
    // exec() = выполнит find
    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
}

// Получаем пост по id - детальный пост
export const fetchChirpbyId = async (id: string) => {
  try {
    connectToDB()

    const chirp = await Chirp.findById(id)
    .populate({
      path: "author",
      model: User,
      select: "_id id name image",
    }) 
    .populate({
      path: "community",
      model: Community,
      select: "_id id name image",
    }) 
    .populate({
      path: "children",
      populate: [
        {
          path: "author", 
          model: User,
          select: "_id id name parentId image", 
        },
        {
          path: "children", 
          model: Chirp, 
          populate: {
            path: "author", 
            model: User,
            select: "_id id name parentId image", 
          },
        },
      ],
    })
    .exec()
    return chirp
    
  } catch (error) {
    throw new Error("Failed to create ChirpById")
  }
}

// Добавляем комментарии для поста
export const addCommentToChirp = async(
  chirpId: string,
  commentText: string,
  userId: string,
  path: string
) => {
  try {
    connectToDB()
    // Получаем пост к которому будем добавлять комментарии
    const originalChirp = await Chirp.findById(chirpId)
    if (!originalChirp) {
      throw new Error("Chirp not found");
    }

    const commentChirp = new Chirp({
      text: commentText,
      author: userId,
      parentId: chirpId, 
    });
    const savedCommentChirp = await commentChirp.save()

    // Добавляем в поле children поста id комментария
    originalChirp.children.push(savedCommentChirp._id)
    await originalChirp.save();

    revalidatePath(path)
  } catch (error) {
    
  }
}