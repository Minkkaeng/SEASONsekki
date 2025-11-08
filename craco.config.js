/** @type {import('@craco/craco').CracoConfig} */
module.exports = {
  babel: {
    plugins: [
      [
        'babel-plugin-react-compiler',
        {
          // 기본 설정으로 React Compiler v1 활성화
        }
      ]
    ]
  }
};


