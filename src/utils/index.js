/**
 * @name exports
 * @summary Convenience wrapper for error handling async/await
 * @example
 *	const [ err, thing ] = await asyncHandler(somePromise(...));
 *	if (err) console.error('Something happened')
 */
const asyncWrapper = (promise) => promise.then((data) => [undefined, data]).catch((err) => [err]);

module.exports = {
  asyncWrapper,
};
