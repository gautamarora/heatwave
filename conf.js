// FOR FIRST ADMIN USER
// mongo
// use memecube-production (or whichever database you're using)
// admin = db.users.findOne({'twit.screenName': 'gautam'})
// admin = db.users.findOne({'twit.screenName': 'justinschier'})
// admin = db.users.findOne({'twit.screenName': 'dopalabs'})
// admin = db.users.findOne({'twit.screenName': 'memecube'})
// admin.role = "admin"
// db.users.save(admin)

module.exports = {
    app: {
       	name:            	'HeatWave'
			, version: 					'0.1'
    }
  , hostname: {
        development:     'http://localhost:3000'
      , test:            'http://localhost:3001'
      , beta:            'http://localhost:3000'
      , production:      'http://localhost:3000'
    }
  , mongo: {
        url: {
            development: 'mongodb://192.168.110.172:27017/'
          , test:        'mongodb://localhost:27017/'
          , beta:        'mongodb://localhost:27017/'
          , production:  'mongodb://localhost:27017/'
      }
      , dbname: {
            development: 'heatwave'
          , test:        'heatwave-test'
          , beta:        ''
          , production:  '' 
      }
    }
  , redis: {
        secret: {
            development: 'nudrUF5uswU7ESpa62wrEh6mUmechaxa'
          , test:        'wReTha2usaDRudrurupatAR4Th3VAkaP'
          , beta:        'murEt2egEnEcHupra6rATaGatuwrUbab'
          , production:  'treMeTHubemaJacHasPab2udame8uQeH'
        }
      , url: {
            development: 'redis://127.0.0.1:9007/'
          , test:        'redis://127.0.0.1:9007/'
          , beta:        ''
          , production:  'redis://127.0.0.1:9007/'
        }
    }
};