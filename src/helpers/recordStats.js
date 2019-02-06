export default records =>
  records.reduce(
    (statCountObj, { status }) =>
      statCountObj[status]
        ? Object.assign(statCountObj, {
            [status]: statCountObj[status] + 1,
          })
        : Object.assign(statCountObj, {
            [status]: 1,
          }),
    {}
  );
