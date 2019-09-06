


function createWebStorage() {
  var storage;
  var request = indexedDB.open("MeineTestdatenbank");
  request.onerror = function(event) {
    alert("Warum haben Sie meiner Webapp nicht erlaubt IndexedDB zu verwenden?!");
  };

  request.onsuccess = function(event) {
    storage = request.result;
  };

  return {
    getItem: (key) => {
      return new Promise((resolve, reject) => {
        resolve(storage.getItem(key))
      })
    },
    setItem: (key, item) => {
      return new Promise((resolve, reject) => {
        resolve(storage.setItem(key, item))
      })
    },
    removeItem: (key) => {
      return new Promise((resolve, reject) => {
        resolve(storage.removeItem(key))
      })
    }
  }
}

export default createWebStorage();