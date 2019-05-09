const csvtojson = require('csvtojson')
const AJV = require('ajv')
const ajv = new AJV({
  allErrors: true,
  verbose: true,
  coerceTypes: true,
  useDefaults: 'empty'
})
const validate = ajv.compile(require('./../schema.json'))

const controller = {
  index (req, res) {
    return res.render('index', { schema: JSON.stringify(require('./../schema.json'), null, 2) })
  },
  validate (req, res) {
    if (typeof req.body.type === 'string') {
      csvtojson().fromFile('./csvs/' + req.body.type + '.csv').then(jsonObj => {
        const results = jsonObj.filter(item => Object.values(item).some(result => result.length)).map(item => {
          let valid = validate(item)
          item.errors = []

          if (!valid) {
            item.errors = validate.errors
          }

          return item
        })

        return res.render('validate', { results })
      })
    } else {
      csvtojson().fromFile(req.file.path).then(jsonObj => {
        const results = jsonObj.filter(item => Object.values(item).some(result => result.length)).map(item => {
          let valid = validate(item)
          item.errors = []

          if (!valid) {
            item.errors = validate.errors
          }

          return item
        })

        return res.render('validate', { results })
      })
    }
  }
}

module.exports = controller
