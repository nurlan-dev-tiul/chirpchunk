"use server";

import { revalidatePath } from 'next/cache';
import User from '../models/user.model'
import { connectToDB } from '../mongoose';
import Chirp from '../models/сhirp.model';
import { FilterQuery, SortOrder } from "mongoose";
import Community from '../models/community.model';

interface Params {
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string
}

export const updateUser = async({
  userId,
  username,
  name,
  bio,
  image,
  path
}: Params): Promise<void> => {
  connectToDB()

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );
  
    // Для пересборки страницы используем revalidatePath сбрасываем кэшированные данные
    if(path === "/profile/edit") {
      revalidatePath(path)
    }
  } catch (error) {
    throw new Error("Failed to create/update user")
  }
}

export const fetchUser = async (userId: string) => {
  try {
    connectToDB()
    return await User
      .findOne({id: userId})
      .populate({
        path: "communities",
        model: Community
      })
  } catch (error) {
    throw new Error("Failed to fetch user")
  }
}

// Получаем посты пользователя
export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    const chirps = await User.findOne({ id: userId }).populate({
      path: "chirps",
      model: Chirp,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", 
        },
        {
          path: "children",
          model: Chirp,
          populate: {
            path: "author",
            model: User,
            select: "name image id", 
          },
        },
      ],
    });
    return chirps;
  } catch (error) {
    console.error("Error fetching user chirps:", error);
    throw error;
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    // Добавляем строку из поиска в новый обьект регулярного выражения
    const regex = new RegExp(searchString, "i");

    // Исключить текущего пользователя из результатов.
    // Убираем свой профиль из поиска
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, 
    };

    // Если строка поиска не пуста, 
    // добавьте оператор $or для соответствия полям имени или имени пользователя.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Сортируем по дате
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Общее количество пользователей
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Находим все посты автора
    const userChirps = await Chirp.find({ author: userId });

    const childChirpIds = userChirps.reduce((acc, userChirp) => {
      return acc.concat(userChirp.children);
    }, []);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Chirp.find({
      _id: { $in: childChirpIds },
      author: { $ne: userId }, 
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}
