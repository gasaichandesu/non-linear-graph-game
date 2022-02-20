const { default: axios } = require('axios');
const { Graph, UsageGraphError } = require('graphology');
const { Sigma } = require('sigma');

require('./bootstrap');

/**
 * @type {Graph}
 */
let graph;
let renderer;

const stack = [];

let name = '';

(async () => {
    try {
        const game = await axios.get('/api/games');

        name = game.data.name;

        const container = document.getElementById('graph');

        switchViews(false);

        renderer = new Sigma(graph = Graph.from(JSON.parse(game.data.data)), container, {
            renderLabels: true,
            renderEdgeLabels: true,
        });

        graph.forEachNode((node, attributes) => {
            if (attributes.color === '#00F' || attributes.color === '#0F0') {
                stack.push(node);
            }
        });

        const edges = findEdgesBySource(stack[stack.length - 1]);
        updateForm(stack[stack.length - 1].replace('name', name), edges[0], edges[1]);
    } catch (e) {
        const response = await fetch('/levels.json');
        const json = await response.json();

        graph = Graph.from(json);

        graph.updateNode(
            graph.nodes()[0],
            (attr) => ({
                ...attr,
                color: '#00F'
            })
        );

        updatePath();

        stack.push(graph.nodes()[0]);
    }
})();

document.getElementById('name-form').addEventListener('submit', (event) => {
    event.preventDefault();

    name = document.getElementById('name-input').value;

    switchViews(true);
});

const choice1El = document.getElementById('choice-1');
const choice2El = document.getElementById('choice-2');

const titleEl = document.getElementById('title');

document.getElementById('choice-1').addEventListener('click', onButtonPressed);
document.getElementById('choice-2').addEventListener('click', onButtonPressed);



function onButtonPressed(event) {
    let target = '';
    graph.findEdge((edge, _, __, targetNode) => {
        if (edge === event.target.innerHTML) {
            target = targetNode;
        }
    });

    const edges = findEdgesBySource(target);
    updateForm(target, edges[0], edges[1]);

    graph.updateNode(
        target,
        (attr) => ({
            ...attr,
            color: '#00F'
        })
    );


    updatePath();

    saveState();

    stack.push(target);
};

const updateForm = (title, choice1, choice2) => {
    choice1El.innerText = choice1;
    choice2El.innerText = choice2;

    titleEl.innerText = title;
};

function findEdgesBySource(sourceNode) {
    return graph.filterOutEdges((_, __, source) => source == sourceNode);
}

function updatePath() {
    graph.forEachNode((node, attributes) => {
        if (!stack.includes(node)) {
            if (attributes.level <= stack.length) {
                graph.updateNode(
                    node,
                    (attr) => ({
                        ...attr,
                        color: '#F00'
                    })
                );
            }

            return;
        }

        graph.updateNode(
            node,
            (attr) => ({
                ...attr,
                color: '#0F0'
            })
        );
    });
}

async function switchViews(shouldRerender) {
    document.getElementById('name').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('graph').style.display = 'block';

    const container = document.getElementById('graph');

    if (!shouldRerender) {
        return;
    }

    renderer = new Sigma(graph, container, {
        renderLabels: true,
        renderEdgeLabels: true,
    });

    const edges = findEdgesBySource(graph.nodes()[0]);
    updateForm(graph.nodes()[0].replace('name', name), edges[0], edges[1]);
}

function saveState() {
    axios.post(
        '/api/games',
        {
            name: name,
            data: JSON.stringify(graph.export())
        }
    );
}