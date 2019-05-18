const express = require('express');

const authorController = require('../controllers/authorController');

const authorRouter = express.Router();

function router(nav) {
  const { getIndex, getById, getMiddleware, renderById } = authorController(
    nav,
  );
  authorRouter.use(getMiddleware);
  authorRouter.route('/').get(getIndex);

  authorRouter
    .route('/:id')
    .all(getById)
    .get(renderById);
  return authorRouter;
}

module.exports = router;
