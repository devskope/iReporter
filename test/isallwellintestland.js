export default ({ expect, logger }) => {
  logger('testing to see if setup worked...... (setup? set-up??)');

  it('expect two instances of the exact same string to be equal', async () => {
    expect('hello, i am iReporter').eq('hello, i am iReporter');
  });
};
