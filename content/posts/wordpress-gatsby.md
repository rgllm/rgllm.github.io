---
title: 'From monolithic to headless: how and why you should adapt your WordPress stack'
date: '2020-07-03T00:00:00.322Z'
excerpt: 'How to adapt your WordPress stack to use a more headless approach with newer technologies.'
image: '/static/images/wordpress-gatsby.png'
---

Every dynamic website consists of two main parts: the backend and the frontend. The backend, which in marketing websites is commonly a Content Management System (CMS), allows the website owners to manage as much content as needed without handling code changes. The frontend displays all of that content for the website users.

At Pixelmatters, we use a variety of CMS and frameworks to build websites. One of these solutions is WordPress, in which we have built large scale projects like [Rubrik](https://www.pixelmatters.com/work/rubrik-corporate-website-design/), using it for both the backend and frontend. This approach is very convenient however, there a lot of advantages of decoupling the two parts, especially performance. For these reasons, we decided to adapt our WordPress stack to use a more headless approach with newer technologies. This post aims to describe how we adapted our marketing websites stack maintaining high-quality standards.

## 🗿Our old stack and the monolithic way to use WordPress

We’ve used WordPress before with marketing websites at Pixelmatters. It allows our clients to edit website content independently and adding flexibility without compromising the overall design. These websites are built using this CMS, serving both as the backend and frontend, or what is called a monolithic approach.

On our old stack, the backend uses a combination of WordPress hooks and ACF to create custom blocks that are assigned to [custom page templates](https://developer.wordpress.org/themes/template-files-section/page-template-files/). The frontend is built on a custom theme that uses [Timber](https://github.com/timber/timber), a plugin that adds [Twig Template Engine](https://twig.symfony.com/) support in WordPress, allowing us to separate PHP files and component/HTML files.

![](https://cdn-images-1.medium.com/max/5600/1*aueQ84-lH7hfNrE54MEwTg.png)

## 🎭 The future of WordPress is headless

WordPress come a long way since the first introduction 17 years ago, evolving from a simple blog publishing platform to a fully-featured CMS, to an online store managing system. This freedom to use WordPress in very distinct scenarios resulted in increasing use of the CMS which is present now in more than 30% of the top 10 million sites, according to [W3Techs](https://w3techs.com/technologies/history_overview/content_management/all). These numbers allied with the large community caused more and more growing knowledge about WordPress itself, especially in marketing teams. However, WordPress is built in old technologies and its restrictive architecture doesn’t offer the possibilities that sometimes we need while working on client websites, especially when it comes to performance optimization, one of the key points [Google takes into account while ranking a website](https://developers.google.com/web/updates/2018/07/search-ads-speed).

Since the introduction of the REST API in WordPress, it can be used in a headless way, allowing developers to use it as a backend (where it really shines) and separating the frontend, where we can use frontend-focused technologies. This way the model and the controller are bundled together on the WordPress side, handling all data manipulation and database interaction and the frontend only interact with the REST API.

This way we ensure the correct separation of concerns since the frontend and the backend interact via endpoints making it possible to host them in separate servers specifically optimized for their purpose. A backend server optimized for PHP applications and a frontend server optimized to deal with Node.js applications. With this separation, we also ensure that exploiting the website through the backend becomes more difficult since it’s largely hidden from the public. Commonly exploited WordPress routes, like _wp-login.php_ or _xmlrpc.php_ are no longer available to the public.

In addition to this, using WordPress as a headless CMS makes it possible to use modern JS libraries like ReactJS, Vue.js, or Angular delivering highly dynamic web apps. This also future-proofs the website implementation, letting us redesign the site without re-implementing the CMS itself, and allows us to deliver more performant websites with minimum effort by shifting display logic to the client-side and streamlining the backend.

## 💁 Choosing the frontend framework

When it comes to creating a website, there’s no shortage of JS frameworks that allow us to create beautiful and functional frontends. However, when it comes to running WordPress headless it can become easy to get bogged down with the particulars of WordPress and the process of fetching data using the WordPress API. For this reason, one of the things we set up as a goal from the beginning was to choose a framework that natively supported the WordPress API. This led us to choose [GatsbyJS](http://gatsbyjs.org/), an open-source framework based on React with native support for modern technologies like GraphQL and Progressive Web Apps that have a lot of advantages.

It offers support for multiple data sources making it possible to combine, for example, data from WordPress and databases, APIs, or even Markdown files. The support for the WordPress REST API is done trough [gatsby-source-wordpress](https://www.gatsbyjs.org/packages/gatsby-source-wordpress/), which automatically pulls the data and makes all endpoints available for the frontend.

On the performance side, GatsbyJS brings some out of the box optimizations. It generates all the pages content during the build process making the website fast and once loaded. Gatsby prefetches resources for other pages so clicking around the site feels almost instantaneous.

On the other hand, the way GatsbyJS works and the reason why it can do these performance optimizations is the fact that it fetches all the needed data to populate the pages during the build process. This means that for each WordPress data update the frontend needs to rebuild, resulting in a big disadvantage for websites with a lot of content changes, for example, news websites.

## 🏛️ Defining an architecture

Early on the first project, we decided to use this new stack it was defined that in order to maintain a scalable and robust codebase we needed to correctly structure both the backend and the frontend before starting the development since this was a completely new way to work. This way we could ensure and maintain the project quality while introducing new features. Furthermore, this architecture could be reused in other projects, maintaining the same structure, and allowing developers to work on multiple projects using WordPress and GatsbyJS.

## 📝 Backend Architecture

In the WordPress backend, we follow an architecture similar to what we used on monolithic installations. We have a set of WordPress page templates and then we assigned custom ACF components to that page templates. Usually, these components are directly mapped to React components on the frontend. We also create Custom Post Types to define custom data structures, and that use the same components imported on the common pages.

## 🖼️ Frontend Architecture

On the frontend, we use a common Gatsby architecture. The framework pulls the data from WordPress REST API. This data includes posts, pages, custom post types, menus, and global options like for example logos. Thus, we ensure that the client has total flexibility on the backend to change any content that it’s loaded on the frontend. After pulling this data, during development, Gatsby transforms the WordPress REST API into a GraphQL API to be used on the project.

![](https://cdn-images-1.medium.com/max/5600/1*neO1VfbkrUo3qJXg2xvHmQ.png)

During the production build, Gatsby pulls only the data used on the frontend and transforms it into JSON files that are then loaded by the pages, ensuring we only load necessary data.

We also developed an architecture for the frontend components taking into account the WordPress structure itself and the way Gatsby works internally, resulting in the following types of components:

- **Layout** — The layout is the global component and the parent of all other components;

- **Views** — Views are connected to the router and directly mapped to WordPress page templates. So, for example, if we have a Contact Us page template we have a Contact Us View in the frontend that is responsible to fetch all the data used on the page through a GraphQL query and to importing all the children Partials and View Components used;

- **Partials** — Partials are reused across all the site with a particular difference to View Components, this type of component include the data fetch, which means they can connect to external data sources. On GatsbyJS we do this using [GraphQL Static Queries](https://www.gatsbyjs.org/docs/static-query/), commonly used for menus and sidebars that need to be independent of the page;

- **Global Components** — Components reused across all the websites and imported on Views or Partials.

## 🔮 Future improvements

We’re now working on a new version of this stack to implement WPGraphQL and removing the middle step of transforming the WordPress REST API into a GraphQL API. This will be done using the upcoming gatsby-source-wordpress V4, rewritten from the ground up using WPGraphQL for data sourcing as well as a custom plugin WPGatsby to transform the WPGraphQL schema in Gatsby-specific ways.

![](https://cdn-images-1.medium.com/max/5600/1*TcULMcaQvvXsOkwyX7RvHQ.png)

## 🚀 Results and conclusions

While the monolithic way to use WordPress is very convenient this new stack has proven to offer more advantages than disadvantages. We’ve now shipped two client websites using this stack and we noticed two big benefits. The first one is obviously the performance, we are getting really good results out of the box and without the need to assign specific tasks for this. For example, on one website we got from 24 to 93 points on Google PageSpeed Performance without any specific optimization, just using native GatsbyJS features.

![](https://cdn-images-1.medium.com/max/5600/1*uSDIevfx2XkygLy6A8EfWQ.png)

The second benefit is the use of new technologies that allow us to make the websites more dynamic. For example, we had recently to ship a new functionality in one website where the user has a favorite store, which is chosen taking into account their preference and location, and this selection is shared across all the website allowing the components to render specific information for that user. While this is also possible in a common WordPress website, the effort to do this is exponentially higher. Marketing websites become true interactive experiences for users. The backend becomes only the system of record and “state machine”, but back-and-forth interaction happens in real-time in the browser.

On the other hand, this type of stack requires some client education since they’ve to understand how all the stack works. One of the main things it’s the use of WordPress plugins and mirroring those plugins to the frontend. The two parts of the website are isolated, which means that if for example, you install a new plugin for custom buttons on WordPress those buttons will not be available on the frontend and require additional development. Also, another thing that comes to a lot of times is the build time. When publishing or editing a new page, clients need to understand that the frontend needs to rebuild and that is not instantaneous, though this is improved a lot with [Gatsby Incremental Builds](https://www.gatsbyjs.org/blog/2020-04-22-announcing-incremental-builds/).

In conclusion, we believe this new approach brought us a lot of benefits on our marketing websites stack, however, there are still a couple of pain points that we hope to solve with time.
