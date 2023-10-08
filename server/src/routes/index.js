const AppError = require('../utils/appError')
const userRouter = require('./userRoutes')
const postRouter = require('./postRoutes')


const initRoutes = (app) => {
  app.use('/api/v1/users', userRouter)
  app.use('/api/v1/posts', postRouter)
  // app.all('*', (req, res, next) => {
  //   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  // });
  return app.use('/', (req, res) => {
    res.send('server on...')

  })
}

module.exports = initRoutes