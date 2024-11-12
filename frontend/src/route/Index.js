import React, { Suspense, useEffect, useLayoutEffect } from "react";
import { Routes, createBrowserRouter } from "react-router-dom";
import Shop from '../pages/Shop.js';
import Login from '../auth/Login.js';
import Register from '../auth/Register';
import Layout from '../layout/Index';
import LayoutAdmin from '../Admin/Layout/Index'
import MoneyPay from '../pages/MoneyPay.js'
import Cart from '../pages/Cart.js'
import MoneyMan from '../pages/LsNapTien.js'
import Account from '../pages/Account.js'
import OrderOpen from  '../pages/OrderOpen.js'
import OrderAll from  '../pages/OrderAll.js'
import Product from '../Admin/Pages/Product.js'
import Transfer from '../Admin/Pages/Transfer.js'
import HistoryTransfer from '../Admin/Pages/HistoryTransfer.js'
import ProductDetail from '../pages/ProductDetail.js'
import User from '../Admin/Pages/User.js'
import OpenGift from '../pages/OpenGift.js'
import MoneyGet from '../pages/MoneyGet.js'
import QlyRutTien from '../Admin/Pages/QlyRutTien.js'
import AdminInfor from '../Admin/Pages/AdminInfor.js'
import LsRutTien from '../pages/LsRutTien.js'
import ProtectedRoute from "./ProtecttedRoute.js";
export const router = createBrowserRouter([
    {
      path: "dang-nhap",
      element: <Login />,
    },
    {
        path: "dang-ky",
        element: <Register />,
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <LayoutAdmin />
          </ProtectedRoute>
        ),
      //   errorElement: <NotFound />,
        children: [
          {
            path: "",
            element: <Product />,
          },
          {
            path: "transfer",
            element: <Transfer />,
          },
          {
            path: "rut-tien",
            element: <QlyRutTien />,
          },
          {
            path: "history-transfer",
            element: <HistoryTransfer />,
          },
          {
            path: "user",
            element: <User />,
          },
          {
            path: "admin-infor",
            element: <AdminInfor />,
          },

        ]
      },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
    //   errorElement: <NotFound />,
      children: [
        {
          path: "",
          element: <Shop />,
        },
        {
            path: "/cart",
            element: <Cart />,
          },
          {
            path: "/money-pay",
            element: <MoneyPay />,
          },
          {
            path: "/money-man",
            element: <MoneyMan />,
          },
          {
            path: "/money-get",
            element: <MoneyGet />,
          },
          {
            path: "/ls-rut-tien",
            element: <LsRutTien />,
          },
          {
            path: "/account",
            element: <Account />,
          },
          {
            path: "/detail/:id",
            element: <ProductDetail />,
          },
          {
            path: "/open/:id",
            element: <OpenGift />,
          },
          {
            path: "/da-mua",
            element: <OrderAll />,
          },
          {
            path: "/da-mo",
            element: <OrderOpen />,
          },
         
    ]
}
  ])
