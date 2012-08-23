[![build status](https://secure.travis-ci.org/davepacheco/node-amqpsnoop.png)](http://travis-ci.org/davepacheco/node-amqpsnoop)
node-amqpsnoop v0.0.1
==============

Overview
--------

usage: amqpsnoop [-h host] [-r routekey] [-f filter...]

Snoops AMQP messages sent to routekey <routekey> using broker <host>.
All messages must be JSON-encoded objects.  The following options may 
be specified:

    -h host        hostname of AMQP broker to use (default: localhost)

    -r routekey    routekey to bind to (default: "#")

    -f filter      filter expression to invoke on each message
                   Multiple filters may be specified.  Each one is a 
                   chunk of JavaScript code to be executed with each 
                   message bound to variable "msg".  The message is 
                   only printed if all filters return true.

    -o format      output messages with the given format
                   Valid values are "inspect" (uses sys.inspect, the)
                   default), "json" and "json0" (JSON with no
                   indentation).

Example: using broker 10.99.99.5, show all AMQP messages sent to any 
routing key starting with "ca." and whose "ca_subtype" member is not 
"ping":

    amqpsnoop -h 10.99.99.5 -r "ca.#" -f 'msg.ca_subtype != "ping"'


Installation
------------

As an npm package, node-amqpsnoop is installed in the usual way:

      % npm install amqpsnoop


Status
------

This tool is considered complete, though additional functionality may be added
in the future.


Platforms
---------

This tool should work on all platforms that support node.js.  It has been
tested on MacOS X 10.6.5 and OpenSolaris based on Illumos build 147.
