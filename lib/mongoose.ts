import mongoose from "mongoose"

let isConnected = false

export const connectToDB = async () => {
  //Устанавливаем строгий режим для запросов
  // Mongoose будет выбрасывать ошибку, если в запросе обнаружены поля, 
  // которые не определены в схеме модели
  mongoose.set("strictQuery", true)

  if(!process.env.MONGODB_URL) return console.log("MONGODB_URL not found")
  if(isConnected) return console.log("Already connected to Mongo DB")

  try {
    await mongoose.connect(process.env.MONGODB_URL)
    isConnected = true

    console.log("Connected to Mongo DB");
    
  } catch (error) {
    console.log(error);
      
  }
}