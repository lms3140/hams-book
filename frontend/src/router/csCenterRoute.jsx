import { Contact } from "../components/CSCenter/Contact.jsx";
import { CsCenterLayout } from "../components/CSCenter/CsCenterLayout.jsx";
import { FaQ } from "../components/CSCenter/FaQ.jsx";
import { Notice } from "../components/CSCenter/Notice.jsx";
import { QnAForm } from "../components/CSCenter/QnAForm.jsx";
import { CSCenter } from "../pages/CSCenter/CSCenter.jsx";
import { AuthRouter } from "./AuthRouter.jsx";

export const csCenterRoute = [
  {
    element: <CsCenterLayout />,
    children: [
      {
        path: "/cscenter",
        element: <CSCenter />,
      },
      {
        path: "/cscenter/faq",
        element: <FaQ />,
      },
      {
        path: "/cscenter/qna-form",
        element: (
          <AuthRouter>
            <QnAForm />
          </AuthRouter>
        ),
      },
      {
        path: "/cscenter/notice",
        element: <Notice />,
      },
      {
        path: "/cscenter/contact",
        element: <Contact />,
      },
    ],
  },
];
