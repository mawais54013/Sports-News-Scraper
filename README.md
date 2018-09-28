# Tech-News-Scraper
This program allows the user to scrape articles from a website. Which, in this using https://www.technewsworld.com/, tech news is the main topic for this project. So if you what to know the latest tech news just scrape it with this program. 

[Tech News Scraper](https://sports-news.herokuapp.com/)

[Portfolio](https://mawais54013.github.io/New-Portfolio/)

# Images

![website](Screen1.png)
This is the Main Page when user scrapes articles 

![Saved Page](Screen2.png)
This page shows the saved articles with delete and notes submit area.

# Technology Used 
- Handlebars.js
- Javascript
- Node.js
- Mongodb
- Mongoose
- Express.js
- Axios.js
- Cheerio.js
- Heroku

# Code Snippets
1) The following code shows how I used axios and cheerio to get scrape story information from a website. First the route gets is started with scraping from technewsworld anf using cheerio to get the info from the site. The story heading named story-list is where the info is and I use element to grab each factor from that area including title, summary, and url and put them into an array for use latter to display them. 
```
 router.get("/articles", function(req, res) {
        axios.get("https://www.technewsworld.com/").then(function(response) {
        var $ = cheerio.load(response.data);
        $(".story-list").each(function(i, element) {
            var title = $(element).find('.title').find('a').text();
            var url = $(element).find('.teaser').find('span').find('a').attr("href");
            var summary = $(element).find('.teaser').text();
            results[i] = ({
                title: title,
                url: url,
                summary: summary,
                saved: false,
            });
        });
    });
 })

```

2) This delete route is very useful to get rid of a article from your saved area. I tried using destroy at first but errors often came up. So after a little research this findByIdAndDelete is very useful to find a article with the same id and then delete it. After the deletion is complete then the user is rerouted to the same page. 

```
router.get("/delete/:id", function(req, res) {
    Article.findByIdAndDelete({"_id": req.params.id}, function(err, checker) {
        if(err)
        {
            console.log(err);
        }
        else 
        {
            console.log("deleted");
        }
        res.redirect("/save");
    });
});
```
# Author 
[Muhammad Awais](https://mawais54013.github.io/New-Portfolio/)

[Github](https://github.com/mawais54013)
