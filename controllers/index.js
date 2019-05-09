const csvtojson = require('csvtojson')
const AJV = require('ajv')
const ajv = new AJV({
  allErrors: true,
  verbose: true
})
const validate = ajv.compile(require('./../schema.json'))

const controller = {
  index (req, res) {
    return res.render('index', { schema: JSON.stringify(require('./../schema.json'), null, 2) })
  },
  validate (req, res) {
    csvtojson().fromFile(req.file.path).then(jsonObj => {
      const results = jsonObj.filter(item => Object.values(item).some(result => result.length)).map(item => {
        item.GeoX = isNaN(item.GeoX) ? item.GeoX : +item.GeoX
        item.GeoY = isNaN(item.GeoY) ? item.GeoY : +item.GeoY
        item.Hectares = isNaN(item.Hectares) ? item.Hectares : +item.Hectares
        item.MinNetDwellings = isNaN(item.MinNetDwellings) ? item.MinNetDwellings : +item.MinNetDwellings
        item.NetDwellingsRangeFrom = isNaN(item.NetDwellingsRangeFrom) ? item.NetDwellingsRangeFrom : +item.NetDwellingsRangeFrom
        item.NetDwellingsRangeTo = isNaN(item.NetDwellingsRangeTo) ? item.NetDwellingsRangeTo : +item.NetDwellingsRangeTo

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

module.exports = controller
