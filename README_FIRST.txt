This file is "out of character", in that it would not be an actual part of a production checkin
of this code.  Its purpose is to outline the simulation I ran and the boundaries I set for that
simulation.

The simulation's idea was that an existing production website already existed, and this repo
contained a "marginal added page" to that website.  This limitation was necessary because
otherwise it would be necessary to make at least production quality deployment and monitoring
code for the website, if not remote logging, continuous integration or other things.  That 
would clearly be harder than the original challenge, so it was skipped.

Another part of the simulation was the assumption that there would exist a library of re-useable
web components, perhaps in React or some other framework, with associated CSS.  This was done 
for the same reason as the above, that creating a from-scratch reuseable web component framework 
was harder than the original assignment.  This also means that the actual webpage is not production 
quality.  It has no unit tests, and would in fact be difficult to test as written because it is
not part of an inverson of control framework.  It also means that the CSS is quite minimalist.

So what is in scope?  Mostly the Timeseries object and associated Analysis objects.  Those have 
100% line and 90% branch coverage with unit tests.  I also googled for "ohlc display library" 
and incorporated one of the top results, Plotly.  So I would say that the way Plotly is 
used is not production-worthy, but the idea of using Plotly is, and I wanted to show that idea.

I also did a simple security analysis, located in ./security - please take a look.