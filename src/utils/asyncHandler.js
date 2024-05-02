const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
    .catch((err) => next(err));
  }
}

export {asyncHandler};






// using try-catch block

// const asyncHandler = (func) => async(req, res, next) => {
//   try {
//     await func(req, res, next);
//   } catch(error){
//     res.status(err.code || 500).json({
//       succes: false,
//       message: err.message
//     })
//   }
// }

// how to get to the above notation?
// const asyncHandler = () => {}
// const asyncHandler = (func) => {
//   () => {}
// }
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async() => {}
