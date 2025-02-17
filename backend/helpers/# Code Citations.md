# Code Citations

## License: unknown
https://github.com/atul-mane01/RIRM/tree/4236be498c71f93f9e6fdc5cbb0c5006945fe2f5/script.js

```
.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err)
```


## License: unknown
https://github.com/pitatumisang/jobs-api/tree/f2da548f1dc9cedc47802707334ef320a01ebc7e/routes/authRoutes.js

```
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports
```


## License: unknown
https://github.com/altub/Website-with-posts/tree/516bb1b2a622ca5932f4a0bb61237db849a48d84/server/routes/verifyToken.js

```
;
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
```


## License: unknown
https://github.com/LAMA-TEAM/findmyfriends-api/tree/c5173d76beb128ca957599ef5c8e76385e7d123d/src/middlewares/isAuth.js

```
denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token'
```

