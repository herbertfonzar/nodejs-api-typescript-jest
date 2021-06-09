import mongoose, { Mongoose } from 'mongoose'
import config, { IConfig } from 'config'

const dbConfig: IConfig = config.get('App.database')

export const connect = async (): Promise<Mongoose> => 
    await mongoose.connect(dbConfig.get('mongoUrl'), {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

export const close = (): Promise<void> => mongoose.connection.close()