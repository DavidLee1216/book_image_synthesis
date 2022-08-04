# book_image_synthesis
Synthesize image from individual images and text for book cover.
First add data for individual images in synthesis.json under the folder "data"
Json format:
 ex: {"image":"1.png", "sidelogo": "side_logo1.png", "title1":"ERFOLGREICHE", "title2":"TELEFONAKQUISE"}
 "image": main front image
 "sidelogo": side logo image
 "title1": title string in the first line
 "title2": title string in the second line
 
 Front image files should be placed in data/images
 Side logo image files should be placed in data/sides
 The result images are placed in build/images
 The result is png file format.
 It is possible for some settings to be changed in config.js
