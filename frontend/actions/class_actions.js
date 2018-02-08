export const RECEIVE_CLASS_ERRORS = "RECEIVE_CLASS_ERRORS";
export const RECEIVE_CLASSES = "RECEIVE_CLASSES";

export const receiveClassErrors = (error) => ({
  type: RECEIVE_CLASS_ERRORS,
  error
})

// exoprt const receiveClasses = (classes) => ({
//   type: RECEIVE_CLASSES,
//   classes
// })

export const addClass = (newClass, db) => dispatch => (
  db.database().ref('classes/').push().set(newClass)
    .then()
    .catch(error => {
      console.log(newClass);
      console.log(error);
      dispatch(receiveClassErrors(error.message))
    })
)
