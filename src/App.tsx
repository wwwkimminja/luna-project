import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/layout"
import Home from "./routes/home"
import Profile from "./routes/profile"
import CreateAccount from "./routes/create-account"
import Login from "./routes/login"
import { createGlobalStyle } from "styled-components"
import reset from "styled-reset"


const router = createBrowserRouter([
  {
  path:"/",
  element:<Layout/>,
  children:[
    {
      path:"",
      element:<Home/>,
    },
    {
      path:"profile",
      element:<Profile/>,
    },
  ]
},
{
  path:"/login",
  element:<Login/>
},
{
  path:"/create-account",
  element:<CreateAccount/>
}
])
const GlobalStyle = createGlobalStyle`
  ${reset},
  *{
    box-sizing: border-box;
  }
  body {
    background-color:black;
    color:white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`


function App() {

  return (
    <>
      <GlobalStyle />
      <RouterProvider router={router} />
    </>
  )
}

export default App
