var ans =
{"realtime":{"id":"demo","attention":{"x":0,"y":0,"scaler":1},"items":{"files":[],"drawboards":[],"textBoxes":[],"commentBoxes":[]}},"timetravel":{},"timemachine":[]}

var imgStore = {
  'demo': {}
}
var rootStore = {
  'demo': ans
}


exports.writeFile = ({ spaceID, fileID, fileData }) => {
  imgStore[spaceID][fileID] = fileData
  // console.log(imgStore);
}
exports.readFile = ({ spaceID, fileID }) => {
  return imgStore[spaceID || 'demo'][fileID]
}

exports.readRoot = ({ spaceID }) => {
  return rootStore[spaceID]
}

exports.attention = ({ root, spaceID, attention }) => {
  if (root.realtime.id === spaceID) {
    root.realtime.attention.x = attention.x
    root.realtime.attention.y = attention.y
    root.realtime.attention.scaler = attention.scaler
  }
}

exports.add = ({ data, root }) =>  {
  var array = root.realtime.items[data.arrayName]
  // console.log(data)
  array.push(data.item)
}

exports.remove = ({ data, root }) => {
  var array = root.realtime.items[data.arrayName]
  var result = array.filter((item) => { return item.id === data.item.id })
  var index = array.indexOf(result[0])
  array.splice(index, 1)
}

exports.update = ({ data, root }) => {
  var array = root.realtime.items[data.arrayName]
  var result = array.filter((item) => { return item.id === data.item.id })
  var index = array.indexOf(result[0])
  // console.log(data.item)
  if (array[index]) {
    for (var key in data.item) {
      array[index][key] = data.item[key]
    }
  }
}

exports.onReadRoot = () => {
  return exports.readRoot({ spaceID: 'demo' })
}

exports.onAdd = ({ data }) => {
  exports.add({ data, root: exports.readRoot({ spaceID: 'demo' }) })
}

exports.onRemove = ({ data }) => {
  exports.remove({ data, root: exports.readRoot({ spaceID: 'demo' }) })
}

exports.onUpdate = ({ data }) => {
  exports.update({ data, root: exports.readRoot({ spaceID: 'demo' }) })
}

exports.onAttention = ({ data }) => {
  exports.attention({ attention: data.attention, spaceID: data.spaceID, root: exports.readRoot({ spaceID: 'demo' }) })
}