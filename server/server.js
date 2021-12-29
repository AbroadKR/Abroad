require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const {
  table,
  forUniv,
  comment,
  review,
  user,
  allBoard,
  asiaBoard,
  southAmericaBoard,
  northAmericaBoard,
  africaBoard,
  europeBoard,
  oceaniaBoard,
} = require('./db/database');
const { PORT } = process.env;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(express.json());
app.use(express.text());

app.listen(PORT, () => {
  console.log('Listening on 8080 Port💡');
});

app.get('/api/getKoUnivs', (req, res) => {
  table
    .find({}, (err, koUnivs) => {
      if (err) {
        res.end();
        return;
      }
      res.json(koUnivs);
    })
    .select('koUniv')
    .distinct('koUniv');
});

app.post('/api/getContinents', (req, res) => {
  const {
    body: { selKoUniv },
  } = req;
  table
    .find({ koUniv: selKoUniv }, (err, tables) => {
      if (err) {
        res.end();
        return;
      }
      res.json(tables);
    })
    .select('continent')
    .distinct('continent');
});

app.post('/api/getCountries', (req, res) => {
  const {
    body: { selKoUniv, selContinent },
  } = req;
  const continentList = selContinent.split(',');
  table
    .find(
      {
        koUniv: selKoUniv,
        continent: { $in: continentList },
      },
      (err, tables) => {
        if (err) {
          res.end();
          return;
        }
        res.json(tables);
      }
    )
    .select('country')
    .distinct('country');
});

app.post('/api/getTables', (req, res) => {
  const data = req.body;
  if (!data['continent'] && !data['country']) {
    table
      .find({ koUniv: data['koUniv'] }, (err, tables) => {
        if (err) {
          res.end();
          return;
        }
        res.json(tables);
      })
      .select('continent country forUniv_eng forUniv_kor TO period');
  } else if (data['continent'] && !data['country']) {
    table
      .find(
        {
          koUniv: data['koUniv'],
          continent: { $in: data['continent'] },
        },
        (err, tables) => {
          if (err) {
            res.end();
            return;
          }
          res.json(tables);
        }
      )
      .select('continent country forUniv_eng forUniv_kor TO period');
  } else {
    table
      .find(
        {
          koUniv: data['koUniv'],
          continent: { $in: data['continent'] },
          country: { $in: data['country'] },
        },
        (err, tables) => {
          if (err) {
            res.end();
            return;
          }
          res.json(tables);
        }
      )
      .select('continent country forUniv_eng forUniv_kor TO period');
  }
});

// 대학평가 -> 검색창에서 해외대학 이름으로 검색할 때 (onChange)
app.get('/api/getForUnivs', (req, res) => {
  const {
    query: { query },
  } = req;
  if (query.length <= 2) {
    table
      .find(
        { forUniv_eng: { $regex: query, $options: 'i' } },
        (err, tables) => {
          if (err) {
            res.end();
            return;
          }
          res.json(tables);
        }
      )
      .select('_id, forUniv_eng')
      .limit(10);
  } else {
    table
      .find(
        { forUniv_eng: { $regex: query, $options: 'i' } },
        (err, tables) => {
          if (err) {
            res.end();
            return;
          }
          res.json(tables);
        }
      )
      .select('forUniv_eng');
  }
});

app.post('/api/getReviews', (req, res) => {
  const data = req.body;
  forUniv
    .find({ forUniv: data.forUniv }, (err, details) => {
      if (err) {
        res.end();
        return;
      }
      res.json(details);
    })
    .populate({ path: 'reviews', populate: { path: 'owner' } });
});

app.get('/api/getPosts', (req, res) => {
  const {
    query: { board, category },
  } = req;
  if (board === 'all') {
    allBoard
      .find({}, (err, result) => {
        if (err) {
          res.end();
          return;
        }
        res.json(result);
      })
      .populate('owner')
      .populate('comments');
  }
  // 같은 get요청인데.... 어떻게 다른 collection으로부터 데이터를 요청할 수 있을까?
  // parameter 자체에 catergory, board 값을 넣어서 해당 값에 대한 if 조건문을 걸면 될듯 하다.
});
// app.post('/api/getQna', (req, res) => {
//   const num = req.body.page;
//   qna
//     .find({}, (err, qnas) => {
//       if (err) {
//         res.end();
//         return;
//       }
//       res.json(qnas);
//     })
//     .skip((Number(num) - 1) * 15)
//     .limit(Number(num) * 15);
// });
// app.post('/api/getFree', (req, res) => {
//   const num = req.body.page;
//   free
//     .find({}, (err, frees) => {
//       if (err) {
//         res.end();
//         return;
//       }
//       res.json(frees);
//     })
//     .skip((Number(num) - 1) * 15)
//     .limit((Number(num) + 9) * 15);
// });
// app.post('/api/getFree/search', (req, res) => {
//   const {
//     body: { target, keyword },
//   } = req;
//   free.find({ title: { $regex: keyword } }, (err, frees) => {
//     if (err) {
//       res.end();
//       return;
//     }
//     res.json(frees);
//   });
// });
// app.post('/api/getForUnivs', (req, res) => {
//   const data = req.body;
//   if (data.id) {
//     forUniv.find({ _id: data.id }, (err, images) => {
//       if (err) {
//         res.end();
//         return;
//       }
//       res.json(images);
//     });
//   } else if (data.title) {
//     forUniv
//       .find({ forUniv: data.title }, (err, images) => {
//         if (err) {
//           res.end();
//           return;
//         }
//         res.json(images);
//       })
//       .select('image forUniv');
//   }
// });
