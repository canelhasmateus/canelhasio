
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var canelhasio = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function not_equal(a, b) {
        return a != a ? b == b : a !== b;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\svg\Canvas.svelte generated by Svelte v3.31.0 */

    const file = "src\\components\\svg\\Canvas.svelte";

    function create_fragment(ctx) {
    	let svg;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (default_slot) default_slot.c();
    			attr_dev(svg, "class", "svgCanvas svelte-ddoa8o");
    			add_location(svg, file, 2, 0, 38);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);

    			if (default_slot) {
    				default_slot.m(svg, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Canvas", slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Canvas> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Canvas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Canvas",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function fromEntries(arr) {
        return Object.assign({}, ...Array.from(arr, ([k, v]) => ({ [k]: v })));
    }
    function toPixels(value) {
        return `${value}px`;
    }
    function toPercentage(value) {
        return `${value}%`;
    }
    function toAdmensional(value) {
        return `${value}`;
    }
    function mapKeys(fn) {
        return ([key, value], i) => [key, fn(value)];
    }
    function measure(obj, measurer) {
        return fromEntries(Object.entries(obj).map(mapKeys(measurer)));
    }

    /* src\components\svg\Marker.svelte generated by Svelte v3.31.0 */

    const file$1 = "src\\components\\svg\\Marker.svelte";

    function create_fragment$1(ctx) {
    	let circle;

    	let circle_levels = [
    		{ class: "svgMarker" },
    		/*fade*/ ctx[6],
    		/*size*/ ctx[8],
    		/*coordinates*/ ctx[7]
    	];

    	let circle_data = {};

    	for (let i = 0; i < circle_levels.length; i += 1) {
    		circle_data = assign(circle_data, circle_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			set_svg_attributes(circle, circle_data);
    			toggle_class(circle, "svelte-slc5vr", true);
    			add_location(circle, file$1, 18, 0, 649);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(circle, circle_data = get_spread_update(circle_levels, [
    				{ class: "svgMarker" },
    				dirty & /*fade*/ 64 && /*fade*/ ctx[6],
    				dirty & /*size*/ 256 && /*size*/ ctx[8],
    				dirty & /*coordinates*/ 128 && /*coordinates*/ ctx[7]
    			]));

    			toggle_class(circle, "svelte-slc5vr", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $fadeStore,
    		$$unsubscribe_fadeStore = noop,
    		$$subscribe_fadeStore = () => ($$unsubscribe_fadeStore(), $$unsubscribe_fadeStore = subscribe(fadeStore, $$value => $$invalidate(9, $fadeStore = $$value)), fadeStore);

    	let $fadeUnit,
    		$$unsubscribe_fadeUnit = noop,
    		$$subscribe_fadeUnit = () => ($$unsubscribe_fadeUnit(), $$unsubscribe_fadeUnit = subscribe(fadeUnit, $$value => $$invalidate(10, $fadeUnit = $$value)), fadeUnit);

    	let $coordinatesStore,
    		$$unsubscribe_coordinatesStore = noop,
    		$$subscribe_coordinatesStore = () => ($$unsubscribe_coordinatesStore(), $$unsubscribe_coordinatesStore = subscribe(coordinatesStore, $$value => $$invalidate(11, $coordinatesStore = $$value)), coordinatesStore);

    	let $coordUnit,
    		$$unsubscribe_coordUnit = noop,
    		$$subscribe_coordUnit = () => ($$unsubscribe_coordUnit(), $$unsubscribe_coordUnit = subscribe(coordUnit, $$value => $$invalidate(12, $coordUnit = $$value)), coordUnit);

    	let $sizeStore,
    		$$unsubscribe_sizeStore = noop,
    		$$subscribe_sizeStore = () => ($$unsubscribe_sizeStore(), $$unsubscribe_sizeStore = subscribe(sizeStore, $$value => $$invalidate(13, $sizeStore = $$value)), sizeStore);

    	let $sizeUnit,
    		$$unsubscribe_sizeUnit = noop,
    		$$subscribe_sizeUnit = () => ($$unsubscribe_sizeUnit(), $$unsubscribe_sizeUnit = subscribe(sizeUnit, $$value => $$invalidate(14, $sizeUnit = $$value)), sizeUnit);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_fadeStore());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_fadeUnit());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_coordinatesStore());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_coordUnit());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_sizeStore());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_sizeUnit());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Marker", slots, []);
    	
    	
    	
    	let { fadeUnit = writable(toPercentage) } = $$props;
    	validate_store(fadeUnit, "fadeUnit");
    	$$subscribe_fadeUnit();
    	let { sizeUnit = writable(toPixels) } = $$props;
    	validate_store(sizeUnit, "sizeUnit");
    	$$subscribe_sizeUnit();
    	let { coordUnit = writable(toPixels) } = $$props;
    	validate_store(coordUnit, "coordUnit");
    	$$subscribe_coordUnit();
    	let { fadeStore = writable({ opacity: 90 }) } = $$props;
    	validate_store(fadeStore, "fadeStore");
    	$$subscribe_fadeStore();
    	let { coordinatesStore = writable({ cx: 0, cy: 0 }) } = $$props;
    	validate_store(coordinatesStore, "coordinatesStore");
    	$$subscribe_coordinatesStore();
    	let { sizeStore = writable({ r: 0 }) } = $$props;
    	validate_store(sizeStore, "sizeStore");
    	$$subscribe_sizeStore();

    	const writable_props = [
    		"fadeUnit",
    		"sizeUnit",
    		"coordUnit",
    		"fadeStore",
    		"coordinatesStore",
    		"sizeStore"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Marker> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("fadeUnit" in $$props) $$subscribe_fadeUnit($$invalidate(0, fadeUnit = $$props.fadeUnit));
    		if ("sizeUnit" in $$props) $$subscribe_sizeUnit($$invalidate(1, sizeUnit = $$props.sizeUnit));
    		if ("coordUnit" in $$props) $$subscribe_coordUnit($$invalidate(2, coordUnit = $$props.coordUnit));
    		if ("fadeStore" in $$props) $$subscribe_fadeStore($$invalidate(3, fadeStore = $$props.fadeStore));
    		if ("coordinatesStore" in $$props) $$subscribe_coordinatesStore($$invalidate(4, coordinatesStore = $$props.coordinatesStore));
    		if ("sizeStore" in $$props) $$subscribe_sizeStore($$invalidate(5, sizeStore = $$props.sizeStore));
    	};

    	$$self.$capture_state = () => ({
    		writable,
    		measure,
    		toAdmensional,
    		toPercentage,
    		toPixels,
    		fadeUnit,
    		sizeUnit,
    		coordUnit,
    		fadeStore,
    		coordinatesStore,
    		sizeStore,
    		fade,
    		$fadeStore,
    		$fadeUnit,
    		coordinates,
    		$coordinatesStore,
    		$coordUnit,
    		size,
    		$sizeStore,
    		$sizeUnit
    	});

    	$$self.$inject_state = $$props => {
    		if ("fadeUnit" in $$props) $$subscribe_fadeUnit($$invalidate(0, fadeUnit = $$props.fadeUnit));
    		if ("sizeUnit" in $$props) $$subscribe_sizeUnit($$invalidate(1, sizeUnit = $$props.sizeUnit));
    		if ("coordUnit" in $$props) $$subscribe_coordUnit($$invalidate(2, coordUnit = $$props.coordUnit));
    		if ("fadeStore" in $$props) $$subscribe_fadeStore($$invalidate(3, fadeStore = $$props.fadeStore));
    		if ("coordinatesStore" in $$props) $$subscribe_coordinatesStore($$invalidate(4, coordinatesStore = $$props.coordinatesStore));
    		if ("sizeStore" in $$props) $$subscribe_sizeStore($$invalidate(5, sizeStore = $$props.sizeStore));
    		if ("fade" in $$props) $$invalidate(6, fade = $$props.fade);
    		if ("coordinates" in $$props) $$invalidate(7, coordinates = $$props.coordinates);
    		if ("size" in $$props) $$invalidate(8, size = $$props.size);
    	};

    	let fade;
    	let coordinates;
    	let size;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$fadeStore, $fadeUnit*/ 1536) {
    			 $$invalidate(6, fade = measure($fadeStore, $fadeUnit));
    		}

    		if ($$self.$$.dirty & /*$coordinatesStore, $coordUnit*/ 6144) {
    			 $$invalidate(7, coordinates = measure($coordinatesStore, $coordUnit));
    		}

    		if ($$self.$$.dirty & /*$sizeStore, $sizeUnit*/ 24576) {
    			 $$invalidate(8, size = measure($sizeStore, $sizeUnit));
    		}
    	};

    	return [
    		fadeUnit,
    		sizeUnit,
    		coordUnit,
    		fadeStore,
    		coordinatesStore,
    		sizeStore,
    		fade,
    		coordinates,
    		size,
    		$fadeStore,
    		$fadeUnit,
    		$coordinatesStore,
    		$coordUnit,
    		$sizeStore,
    		$sizeUnit
    	];
    }

    class Marker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, not_equal, {
    			fadeUnit: 0,
    			sizeUnit: 1,
    			coordUnit: 2,
    			fadeStore: 3,
    			coordinatesStore: 4,
    			sizeStore: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Marker",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get fadeUnit() {
    		throw new Error("<Marker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fadeUnit(value) {
    		throw new Error("<Marker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sizeUnit() {
    		throw new Error("<Marker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sizeUnit(value) {
    		throw new Error("<Marker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get coordUnit() {
    		throw new Error("<Marker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set coordUnit(value) {
    		throw new Error("<Marker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fadeStore() {
    		throw new Error("<Marker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fadeStore(value) {
    		throw new Error("<Marker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get coordinatesStore() {
    		throw new Error("<Marker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set coordinatesStore(value) {
    		throw new Error("<Marker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sizeStore() {
    		throw new Error("<Marker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sizeStore(value) {
    		throw new Error("<Marker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value) {
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            }
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled) {
                        task = null;
                    }
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    function resize(element, size) {
        return Object.assign(Object.assign({}, element), size);
    }
    function displace(element, position) {
        return Object.assign(Object.assign({}, element), position);
    }
    function fade(element, fade) {
        return Object.assign(Object.assign({}, element), fade);
    }

    function displaceStore(store, coordinates) {
        store === null || store === void 0 ? void 0 : store.set(displace(get_store_value(store), coordinates));
    }
    function fadeStore(store, opacity) {
        store === null || store === void 0 ? void 0 : store.set(fade(get_store_value(store), opacity));
    }
    function reshapeStore(store, size) {
        store === null || store === void 0 ? void 0 : store.set(resize(get_store_value(store), size));
    }

    /* src\framework.pages\index.svelte generated by Svelte v3.31.0 */
    const file$2 = "src\\framework.pages\\index.svelte";

    // (79:2) <Canvas>
    function create_default_slot(ctx) {
    	let marker;
    	let current;

    	marker = new Marker({
    			props: {
    				fadeStore: /*hoverTransparency*/ ctx[0],
    				sizeStore: /*hoverSize*/ ctx[2],
    				coordinatesStore: /*hoverCoordinates*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(marker.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(marker, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const marker_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				marker_changes.$$scope = { dirty, ctx };
    			}

    			marker.$set(marker_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(marker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(marker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(marker, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(79:2) <Canvas>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let t0;
    	let main;
    	let div;
    	let h1;
    	let t2;
    	let canvas;
    	let current;
    	let mounted;
    	let dispose;

    	canvas = new Canvas({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			main = element("main");
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Coming Soon™";
    			t2 = space();
    			create_component(canvas.$$.fragment);
    			document.title = "Canelhas";
    			attr_dev(h1, "class", "svelte-svm0x4");
    			add_location(h1, file$2, 76, 2, 2378);
    			attr_dev(div, "class", "flex-row flex-center");
    			add_location(div, file$2, 67, 1, 2164);
    			attr_dev(main, "class", "flex-row flex-center");
    			add_location(main, file$2, 64, 0, 2121);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(div, h1);
    			append_dev(div, t2);
    			mount_component(canvas, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mouseenter", /*fillHover*/ ctx[3], false, false, false),
    					listen_dev(div, "mouseleave", /*fadeHover*/ ctx[4], false, false, false),
    					listen_dev(div, "mousedown", /*increaseHover*/ ctx[5], false, false, false),
    					listen_dev(div, "mouseup", /*decreaseHover*/ ctx[6], false, false, false),
    					listen_dev(div, "mousemove", /*displaceHover*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const canvas_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				canvas_changes.$$scope = { dirty, ctx };
    			}

    			canvas.$set(canvas_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(canvas.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(canvas.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(canvas);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Pages", slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	
    	
    	
    	const hoverTransparency = spring({ opacity: 90 });
    	const hoverCoordinates = spring({ cx: 0, cy: 0 });
    	const hoverSize = spring({ r: 0 });

    	function fillHover(event) {
    		return __awaiter(this, void 0, void 0, function* () {
    			fadeStore(hoverTransparency, { opacity: 90 });
    		});
    	}

    	function fadeHover(event) {
    		return __awaiter(this, void 0, void 0, function* () {
    			fadeStore(hoverTransparency, { opacity: 0 });
    		});
    	}

    	function increaseHover(event) {
    		return __awaiter(this, void 0, void 0, function* () {
    			reshapeStore(hoverSize, { r: 30 });
    		});
    	}

    	function decreaseHover(event) {
    		return __awaiter(this, void 0, void 0, function* () {
    			reshapeStore(hoverSize, { r: 15 });
    		});
    	}

    	function displaceHover(event) {
    		return __awaiter(this, void 0, void 0, function* () {
    			displaceStore(hoverCoordinates, { cx: event.x, cy: event.y });
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Pages> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		__awaiter,
    		Canvas,
    		Marker,
    		spring,
    		displaceStore,
    		fadeStore,
    		reshapeStore,
    		hoverTransparency,
    		hoverCoordinates,
    		hoverSize,
    		fillHover,
    		fadeHover,
    		increaseHover,
    		decreaseHover,
    		displaceHover
    	});

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		hoverTransparency,
    		hoverCoordinates,
    		hoverSize,
    		fillHover,
    		fadeHover,
    		increaseHover,
    		decreaseHover,
    		displaceHover
    	];
    }

    class Pages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pages",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const app = new Pages({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
