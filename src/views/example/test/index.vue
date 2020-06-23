<template>
    <div class="home">
        树形结构：
        <Tree prop="treeList" />
    </div>
</template>

<script>
    // @ is an alias to /src
    import Tree from '@/components/tree/index.vue';

    export default {
        name: 'Dashboard',
        components: {
            Tree
        },
        data() {
            return {
                value2: 50,
                treeList:[{
                    id: 1,
                    label: 'Level one 1',
                    children: [{
                        id: 4,
                        label: 'Level two 1-1',
                        children: [{
                            id: 9,
                            label: 'Level three 1-1-1'
                        }, {
                            id: 10,
                            label: 'Level three 1-1-2'
                        }]
                    }]
                }, {
                    id: 2,
                    label: 'Level one 2',
                    children: [{
                        id: 5,
                        label: 'Level two 2-1'
                    }, {
                        id: 6,
                        label: 'Level two 2-2'
                    }]
                }, {
                    id: 3,
                    label: 'Level one 3',
                    children: [{
                        id: 7,
                        label: 'Level two 3-1'
                    }, {
                        id: 8,
                        label: 'Level two 3-2'
                    }]
                }]
            };
        }
    };
</script>
