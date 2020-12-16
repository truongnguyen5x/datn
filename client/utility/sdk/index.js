
import JSZip from 'jszip'
/**
 * 
 * @param {string} zipName name of zip file, and name of root folder in zip
 * @param {Object[]} data data struct of zip file
 * @param {string} data[].path file name or folder name 
 * @param {string} data[].content content of file
 * @param {Object[]} data[].child list file or folder in this folder
 */
const exportToZip = (zipName, data) => {
    const zip = new JSZip();
    const addToZip = (root, file) => {
        if (file.child) {
          const fol = root.folder(file.path)
          file.child.forEach(i => addToZip(fol, i))
        } else {
          root.file(file.path, file.content)
        }
      }
      const root = zip.folder(zipName)
      data.forEach(i => addToZip(root, i))
      return zip
}   

export default exportToZip