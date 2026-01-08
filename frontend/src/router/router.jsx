import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home/Home.jsx";
import { Layout } from "../pages/Layout/Layout.jsx";
import { StoreInfo } from "../pages/StoreInfo/StoreInfo.jsx";

import { MyPageLayout } from "../pages/Mypage/MyPageLayout.jsx";
import { Orders } from "../pages/Mypage/Orders.jsx";
import { NotFound } from "../pages/NotFound/NotFound.jsx";
import { AuthRouter } from "./AuthRouter.jsx";

import { Addresses } from "../pages/Mypage/Addresses.jsx";
import { Inquiries } from "../pages/Mypage/Inquiries.jsx";
import { Profile } from "../pages/Mypage/Profile.jsx";
import { Reviews } from "../pages/Mypage/Reviews.jsx";
import { WishList } from "../pages/Mypage/WishList.jsx";
import { Search } from "../pages/Search/Search.jsx";
import { csCenterRoute } from "./csCenterRoute.jsx";
import { loginRoute } from "./loginRoute.jsx";
import { paymentRoute } from "./paymentRoute.jsx";
import Detail from "../pages/Detail/Detail.jsx";
import { testRoute } from "./testRoute.jsx";
import Cart from "../pages/Cart/Cart.jsx";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/store-info/:pid",
        element: <StoreInfo />,
      },
      {
        path: "/detail/:bookId",
        element: <Detail />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      ...csCenterRoute,
      ...testRoute,
    ],
  },
  ...loginRoute,
  {
    element: (
      <AuthRouter>
        <Layout />
      </AuthRouter>
    ),
    children: [
      {
        path: "/mypage",
        element: <MyPageLayout />,
        children: [
          { path: "orders", element: <Orders /> },
          { path: "wishlist", element: <WishList /> },
          { path: "profile", element: <Profile /> },
          { path: "reviews", element: <Reviews /> },
          { path: "addresses", element: <Addresses /> },
          { path: "inquiries", element: <Inquiries /> },
        ],
      },
      ...paymentRoute,
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
