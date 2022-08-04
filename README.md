# book_image_synthesis
Synthesize image from individual images and text for book cover.

First of all, add data for individual images and titles to synthesis.json under the folder "data".

Json format:
 ex: {"image":"1.png", "sidelogo": "side_logo1.png", "title1":"ERFOLGREICHE", "title2":"TELEFONAKQUISE"}
 "image": main front image
 "sidelogo": side logo image
 "title1": title string in the first line
 "title2": title string in the second line
 
 Front image files should be placed in data/images
 Side logo image files should be placed in data/sides
 Background image and main logo files should be placed in root directory.
 The result images are placed in build/images
 Required data: background image, main front image, company logo image, side logo image, title1, title2 (may be blank), synthesis.json
 
 The result is png file format.

It is possible for some settings to be changed in config.js
