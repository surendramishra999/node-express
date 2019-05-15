const express = require('express');

const adminRouter = express.Router();

function router(nav) {
  adminRouter.route('/').get((req, res) => {
    res.send('admin route');
  });
  return adminRouter;
}

module.exports = router;
