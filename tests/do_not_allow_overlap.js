/**
  * Based on master test (but from index.html, not unit-test version) step 1332. 
  */
var environ =
{   
    'reductor': 1,

    'images':
    {
        0: {'url': '/img/green_crazy_cat.png'}, 
        1: {'url': '/img/tapok.png', 'width': 60, 'height': 60}
    },

    'bodies':
    {
        0: {
            'id': 'cat',
            'mass': 60,
            'pos': {'x': 422.12445990715224, 'y': 501.85082801786274},
            'velocity': {'x': 3.318803638677091, 'y': -2.6353862378703523},
            'behaviours':
            {
                'attracts': [1, 2, 3],
                'collides': [1, 2, 3],
                'boundbox': true
            },
            'imageKey': 0
        },

        1: {
            'id': 'tapok-1',
            'mass': 30,
            'pos': {'x': 861.542815730675, 'y': 146.28368516431297},
            'velocity': {'x': 35.451387113253126, 'y': -5.576513385748847},
            'behaviours': 
            {
                'attracts': [0],
                'collides': [0, 2, 3],
                'boundbox': true
            },
            'imageKey': 1
        },

        2: {
            'id': 'tapok-2',
            'mass': 30,
            'pos': {'x': 923.8437349587349, 'y': 464.4371356218575},
            'velocity': {'x': -46.15626504126515, 'y': -1.985101528342467},
            'behaviours': 
            {
                'attracts': [0],
                'collides': [1, 2, 3],
                'boundbox': true
            },
            'imageKey': 1
        },

        3: {
            'id': 'tapok-3',
            'mass': 30,
            'pos': {'x': 857.2043053479026, 'y': 465.8348417830067},
            'velocity': {'x': 39.807708049853694, 'y': -1.8023908559890764},
            'behaviours': 
            {
                'attracts': [0],
                'collides': [0, 1, 2],
                'boundbox': true
            },
            'imageKey': 1
        }
    },
};