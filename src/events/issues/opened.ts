import * as github from '@actions/github';

const run = async () => {
  console.log(github.context);
};

export default run;
