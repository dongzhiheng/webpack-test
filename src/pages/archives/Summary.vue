<template>
    <div class="v-container">
        <navbar></navbar>
        <div class="v-box">
            <div class="summary">
                <highcharts :options="options"></highcharts>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'archivesSummary',
    data() {
        return {
            options: {
                chart: {
                    type: 'column'
                },

                xAxis: {
                    categories: ['Green', 'Pink']
                },
                credits:{
                    enabled:false
                },
                series: [{
                    data: [{
                        name: 'Point 1',
                        color: '#00FF00',
                        y: 1
                    }, {
                        name: 'Point 2',
                        color: '#FF00FF',
                        y: 5
                    }]
                }]
            }
        }
    }
}

</script>

