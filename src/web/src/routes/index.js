import VerifyIFrame from '../views/Verification/VerifyIFrame'

const indexRoutes = [
  { path: '/verify/:locale',
    component: VerifyIFrame
  },
  { path: '/verify',
    component: VerifyIFrame
  },
  {
    path: '/:locale',
    component: VerifyIFrame
  },
  {
    path: '/',
    component: VerifyIFrame
  }

];

export default indexRoutes;