  const fs = require('fs')
  let _monayOrg = JSON.parse(fs.readFileSync('./storage/user/money.json'))
  let monayAwal = global.limitawal.monayawal
  const addInventoriMonay = (sender) => {
        const obj = {id: sender, monay: monayAwal}
         _monayOrg.push(obj)
        fs.writeFileSync('./storage/user/money.json', JSON.stringify(_monayOrg))
   }
  const cekDuluJoinAdaApaKagaMonaynyaDiJson = (sender) => {
            let status = false
            Object.keys(_monayOrg).forEach((i) => {
                if (_monayOrg[i].id === sender) {
                    status = true
                }
            })
            return status
        }
  const addMonay = (sender, amount) => {
            let position = false
            Object.keys(_monayOrg).forEach((i) => {
                if (_monayOrg[i].id === sender) {
                    position = i
                }
            })
            if (position !== false) {
                _monayOrg[position].monay += amount
                fs.writeFileSync('./storage/user/money.json', JSON.stringify(_monayOrg))
            }
        }
   const kurangMonay = (sender, amount) => {
            let position = false
            Object.keys(_monayOrg).forEach((i) => {
                if (_monayOrg[i].id === sender) {
                    position = i
                }
            })
            if (position !== false) {
                _monayOrg[position].monay -= amount
                fs.writeFileSync('./storage/user/money.json', JSON.stringify(_monayOrg))
            }
        }
   const getMonay = (sender) => {
            let position = false
            Object.keys(_monayOrg).forEach((i) => {
                if (_monayOrg[i].id === sender) {
                    position = i
                }
            })
            if (position !== false) {
                return _monayOrg[position].monay
            }
        }     
        
   module.exports = { addInventoriMonay, cekDuluJoinAdaApaKagaMonaynyaDiJson, addMonay, kurangMonay, getMonay }   