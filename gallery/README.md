# Adding New Galleries

Galleries on the website are made of three things:

- The gallery's name, which is shown to the visitor. For example, `Chapter 2`.
- The collection of image files.
- The gallery's "slug", which the site uses to identify the gallery and isn't shown to the visitor.  For example, `event-2`.

<details><summary>**Via the command line (for `git` users)**</summary>
1. Create a new subdirectory under `/gallery`.
2. Create a new file `info.json` with the JSON shown above.
3. Add your image files.
4. Commit and push your change.
</details>

## Via the website


To create a new Gallery, follow these steps. First, we need to create the gallery itself.

1. At the top-right corner of the GitHub page, click "Add File".
2. Click "Create New File".
3. Type the event's slug, and press the slash `/` key.
4. Type `info.json`.
5. In the main text box, paste the following contents:

```json
{
    "title": "Your Gallery Title Goes Here"
}
```
6. Click "Commit Changes".
   - If you like, write a message describing what gallery you're adding.

GitHub will create the folder and the file you just edited. Next, we'll add the images.

1. Browse into the newly created folder.
2. Click "Add File" again, and this time choose "Upload files".
3.  Drag and drop the images you want to add to the gallery.
4.  Click "Commit Changes".

The new gallery will appear on the site in a few moments!