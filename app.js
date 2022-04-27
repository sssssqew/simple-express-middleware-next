// DOM 조회하기
const content = document.getElementById('content')
const pageBtn = document.getElementById('page-btn')

// 라우터 (router)
const urls = []

// 라우트(routes)
const routes = ['/', '/read', '/create', '/update', '/delete', '/test', '/notFound']

// 현재 URL 주소
let currentUrl = routes[0]

// 요청(request) 객체
const req = {
  method: 'GET',
  contentType: 'application/json',
  host: 'localhost:5000' 
}

// 응답(response) 객체
const res = {
  send: (input) => content.innerHTML = input,
  json: (input) => JSON.stringify(input)
}

const next = (currentUrl) => {
  const currentUrlIndex = urls.findIndex(url => url.url === currentUrl) // currentUrl : next 함수의 인자로 전달되는 URL 주소
  console.log(urls[currentUrlIndex]) // next 함수를 호출한 라우트 핸들러
  const nextRouter = currentUrlIndex + 1 < urls.length ? urls[currentUrlIndex+1] : null
  console.log('nextUrl: ', nextRouter) // next 함수를 호출한 라우트 핸들러 다음 순서의 핸들러
  nextRouter && 
  (nextRouter.callback.length === 3 ?  // 라우트 핸들러 파라미터 갯수에 따라 다르게 실행함
  	nextRouter.callback(req, res, next) 
  : nextRouter.callback(req, res) ) // next 함수를 호출한 라우트 핸들러 다음 순서의 핸들러 실행
  return
}

// 미들웨어 함수
const app = {
  get: (url, callback) => urls.push({
    url, callback
  }),
  post: (url, callback) => urls.push({
    url, callback
  }),
  put: (url, callback) => urls.push({
    url, callback
  }),
  delete: (url, callback) => urls.push({
    url, callback
  }),
  use: (callback) => urls.push({
    callback
  })
}

// 미들웨어 등록
app.get('/', (req, res, next) => {
  console.log(req)
  res.send('<h1>This is HOME page !</h1>')
})
app.get('/read', (req, res, next) => {
  res.send('<h1>This is READ page !</h1>')
})
app.post('/create', (req, res) => {
  // res.send('<h1>This is CREATE page !</h1>')
  next && next('/create')
})
app.put('/update', (req, res) => {
  // res.send('<h1>This is UPDATE page !</h1>')
  next && next('/update')
})
app.delete('/delete', (req, res) => {
  res.send('<h1>This is DELETE page !</h1>')
})
app.get('/test', (req, res) => {
  res.send(`
    <h1>Test Page</h1>
    <p>This is test page</p>
    <ul>
      <li>apple</li>
      <li>banana</li>
      <li>orange</li>
    </ul>
  `)
})
app.use((req, res, next) => {
  res.send('<h1>404 page</h1>')
})

console.table(urls) // 라우트 저장

// 페이지 변경하기
const changePage = (currentUrl) => {
  console.log(currentUrl)
  const urlSelected = urls.filter(url => url.url === currentUrl)[0] // 현재 URL 에 대한 라우트 선택
  urlSelected ? // 라우터 핸들러 실행 
    (urlSelected.callback.length === 3 ? urlSelected.callback(req, res, next) : urlSelected.callback(req, res)) // 콜백의 파라미터 갯수에 따라 다르게 실행함
  : urls[urls.length-1].callback(req, res, next) // 폴백 핸들러 실행
}

// 이벤트 핸들러 정의
window.addEventListener('DOMContentLoaded', () => {
  changePage(currentUrl)
})
pageBtn.addEventListener('click', () => {
  const currentUrl = routes[Math.floor(Math.random()*routes.length)]
  changePage(currentUrl)
})
