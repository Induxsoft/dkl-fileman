var fileHandler = {
    DEFAULT_FILES_TO_IGNORE:[],
	EXTENSION_TO_MIME_TYPE_MAP:{},

    load_obj : function (){
        DEFAULT_FILES_TO_IGNORE = [
            '.DS_Store', // OSX indexing file
            'Thumbs.db'  // Windows indexing file
        ];
            
        // map of common (mostly media types) mime types to use when the browser does not supply the mime type
        EXTENSION_TO_MIME_TYPE_MAP = {
            avi: 'video/avi',
            gif: 'image/gif',
            ico: 'image/x-icon',
            jpeg:'image/jpeg',
            jpg: 'image/jpeg',
            mkv: 'video/x-matroska',
            mov: 'video/quicktime',
            mp4: 'video/mp4',
            pdf: 'application/pdf',
            png: 'image/png',
            zip: 'application/zip',
            txt: 'text/plain'
        };
    },

    //================================ UPLOAD FOLDERS & FILES FUNCTIONS
	shouldIgnoreFile:function(file) {
		return DEFAULT_FILES_TO_IGNORE.indexOf(file.name) >= 0;
	},
	copyString:function(aString) {
		return ` ${aString}`.slice(1);
	},
	traverseDirectory:function(entry) {
		const reader = entry.createReader();
		// Resolved when the entire directory is traversed
		return new Promise((resolveDirectory) => {
			const iterationAttempts = [];
			const errorHandler = () => {};
			function readEntries() {
				// According to the FileSystem API spec, readEntries() must be called until
				// it calls the callback with an empty array.
				reader.readEntries((batchEntries) => {
				if (!batchEntries.length) {
					// Done iterating this particular directory
					resolveDirectory(Promise.all(iterationAttempts));
				} else {
					// Add a list of promises for each directory entry.  If the entry is itself
					// a directory, then that promise won't resolve until it is fully traversed.
					iterationAttempts.push(Promise.all(batchEntries.map((batchEntry) => {
						if (batchEntry.isDirectory) {
							return fileHandler.traverseDirectory(batchEntry);
						}
						return Promise.resolve(batchEntry);
					})));
					// Try calling readEntries() again for the same dir, according to spec
					readEntries();
				}
				}, errorHandler);
			}
		  // initial call to recursive entry reader function
		  readEntries();
		});
	  },
	  
	// package the file in an object that includes the fullPath from the file entry
	// that would otherwise be lost
	packageFile:function(file, entry) {
		let fileTypeOverride = '';
		// handle some browsers sometimes missing mime types for dropped files
		const hasExtension = file.name && file.name.lastIndexOf('.') !== -1;
		if (hasExtension && !file.type) {
			const fileExtension = (file.name || '').split('.').pop();
			fileTypeOverride = EXTENSION_TO_MIME_TYPE_MAP[fileExtension];
		}
		return {
			fileObject: file, // provide access to the raw File object (required for uploading)
			fullPath: entry ? fileHandler.copyString(entry.fullPath) : file.name,
			lastModified: file.lastModified,
			lastModifiedDate: file.lastModifiedDate,
			name: file.name,
			size: file.size,
			type: file.type ? file.type : fileTypeOverride,
			webkitRelativePath: file.webkitRelativePath
		};
	},
	  
	getFile:function(entry) {
		return new Promise((resolve) => {
			entry.file((file) => {
				resolve(fileHandler.packageFile(file, entry));
			});
		});
	},
	  
	handleFilePromises:function(promises, fileList) {
		return Promise.all(promises).then((files) => {
			files.forEach((file) => {
				if (!fileHandler.shouldIgnoreFile(file)) {
					fileList.push(file);
				}
			});
		  return fileList;
		});
	},
	  
	getDataTransferFiles:function(dataTransfer) {
		const dataTransferFiles = [];
		const folderPromises = [];
		const filePromises = [];
		
		[].slice.call(dataTransfer.items).forEach((listItem) => {
			if (typeof listItem.webkitGetAsEntry === 'function') {
			const entry = listItem.webkitGetAsEntry();
		
			if (entry) {
				if (entry.isDirectory) {
					folderPromises.push(fileHandler.traverseDirectory(entry));
				} else {
					filePromises.push(fileHandler.getFile(entry));
				}
			}
			} else {
				dataTransferFiles.push(listItem);
			}
		});
		if (folderPromises.length) {
			const flatten = (array) => array.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
			return Promise.all(folderPromises).then((fileEntries) => {
				const flattenedEntries = flatten(fileEntries);
				// collect async promises to convert each fileEntry into a File object
				flattenedEntries.forEach((fileEntry) => {
					filePromises.push(fileHandler.getFile(fileEntry));
				});
				return fileHandler.handleFilePromises(filePromises, dataTransferFiles);
			});
		} else if (filePromises.length) {
			return fileHandler.handleFilePromises(filePromises, dataTransferFiles);
		}
		return Promise.resolve(dataTransferFiles);
	},
	getFiles:function(event){
		const dataTransfer = event.dataTransfer;
		if (dataTransfer && dataTransfer.items) {
			return fileHandler.getDataTransferFiles(dataTransfer).then((fileList) => {
				return Promise.resolve(fileList);
			});
		}
	}
}

window.addEventListener('load', () => {
    fileHandler.load_obj();
});