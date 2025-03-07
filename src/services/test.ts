import instance from './config'

class Test {
  getInfo() {
    return instance.get('https://jsonplaceholder.typicode.com/todos/1')
  }
}
const text = new Test()
export default text
