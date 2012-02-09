#!/usr/bin/env node

/*
 * amqpblaster.js: send AMQP traffic
 *
 * Copyright 2012 Joyent. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var mod_amqp = require('../deps/node-amqp/amqp');
var mod_getopt = require('../deps/node-getopt/lib/getopt');
var mod_sys = require('util');
var mod_vm = require('vm');

var aq_usage_message = [
    'usage: amqpblaster [-h host] [-r routekey]',
    '',
    'Sends AMQP messages to routekey <routekey> using broker <host>. The',
    'following options may be specified:',
    '',
    '    -h host        hostname of AMQP broker to use (default: localhost)',
    '',
    '    -r routekey    routekey to send to (default: "amqpblaster")',
    '',
].join('\n');

var aq_broker = { host: 'localhost' };	/* AMQP configuration */
var aq_routekey = 'amqpblaster';	/* routing key to blast */

var aq_amqp;				/* amqp connection */
var aq_exchange;			/* amqp exchange */

function main()
{
	aqParseOptions();

	aq_amqp = mod_amqp.createConnection(aq_broker);
	aq_amqp.on('ready', function () {
		aq_exchange = aq_amqp.exchange('amq.topic');
		setInterval(aqBlast, 1000);
	});
}

function aqUsage()
{
	console.error(aq_usage_message);
	process.exit(1);
}

function aqParseOptions()
{
	var parser, cc;

	parser = new mod_getopt.BasicParser('r:h:', process.argv);
	while ((cc = parser.getopt()) !== undefined) {
		if (cc['error'])
			aqUsage();

		switch (cc['option']) {
		case 'h':
			aq_broker['host'] = cc['optarg'];
			break;

		case 'r':
			aq_routekey = cc['optarg'];
			break;
		}
	}
}

function aqBlast()
{
	aq_exchange.publish(aq_routekey, {
		source: 'amqpblaster',
		content: 'no content'
	});

	console.log('message published');
}

main();
