module.exports = {
    app: {
        name:             'HeatWave'
      , version:          '0.1'
    }
  , hostname: {
        development:     'http://localhost:3000' 
      , test:            'http://localhost:3001'
      , beta:            'http://localhost:3000'
      , production:      'http://localhost:3000'
    }
  , server: {
        development:     'http://192.168.110.68:3000'
      , test:            'http://192.168.110.68:3001'
      , beta:            'http://192.168.110.68:3000'
      , production:      'http://192.168.110.68:3000'
    }
  , mongo: {
        url: {
            development: 'mongodb://localhost:27017/'
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
            development: ''
          , test:        ''
          , beta:        ''
          , production:  ''
        }
      , url: {
            development: 'redis://localhost:9007/'
          , test:        'redis://localhost:9007/'
          , beta:        ''
          , production:  'redis://localhost:9007/'
        }
    }
};