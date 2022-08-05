# book_image_synthesis
Synthesize image from individual images and text for book cover.

First of all, add data for individual images and titles to synthesis.json under the folder "data".

Json format:
 
 ex:   {
    "image": "1.png",
    "sidelogo": "side_logo1.png",
    "title1": "ERFOLGREICHE",
    "font1": 70,
    "title2": "TELEFONAKQUISE",
    "font2": 64,
    "font3": 80,
    "font4": 60
  }

 
 "image": main front image
 
 "sidelogo": side logo image
 
 "title1": title string in the first line
 
 "title2": title string in the second line
 
 "font1": font for title1
 
 "font2": font for title2
 
 "font3": font for upper side title (could be omitted, then use default size for side title on config.js)
 
 "font4": font for bottom side title (could be omitted, then use default size for side title on config.js)
 
 
 Front image files should be placed in data/images
 
 Side logo image files should be placed in data/sides
 
 Background image and main logo files should be placed in root directory.
 
 The result images are placed in build/images
 
 Required data: background image, main front image, company logo image, side logo image, title1, title2 (may be blank), synthesis.json
 
 
 The result is png file format.


It is possible for some settings to be changed in config.js

To execute application, use command "node index.js"
