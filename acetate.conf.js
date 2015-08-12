
module.exports = function (acetate) {
  // apply metadata in bulk to pages mathcing **/*
  acetate.metadata('**/*', {
    title: 'JS.Geo',
    author: 'Chris Helm'
  });
};
