module.exports = function (app, prisma) {
  app.get('/source/new', async (req, res) => {
    res.render('source-new', {});
    console.log(res.locals.currentUser);
  });
  app.post('/source/new', async (req, res) => {
    const {
      title,
      authorFirstName,
      authorLastName,
      publishDate,
      publishedBy,
      edition,
      volume,
    } = req.body;
    const userId = res.locals.currentUser.id;

    if (!userId) {
      // Handle the case where the user is not logged in or the user ID is not available
      return res.status(403).send('User must be logged in to add a source.');
    }

    try {
      const result = await prisma.source.create({
        data: {
          title,
          authorFirstName,
          authorLastName,
          publishDate: new Date(publishDate + 'T00:00:00Z'),
          publishedBy,
          edition: edition ? parseInt(edition) : null,
          volume: volume ? parseInt(volume) : null,
          userId,
        },
      });
      console.log('Source added successfully!');
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
};
