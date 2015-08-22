 var probability=[],
        radius =[],
        count_tweet =0;
function Tweet_map () {
   

    this.renderMap = function () {
        getter().parsedData();
    }

    this.getter =getter;

    function getter(){                      
        
        function parseData(){
            var useful_data = [],
            temp={},
            i,
            len=tweet_data.length,
            j,
            keys,
            k,
            obj={},
            cache,
            counts=[];
            for(j in tweet_data[0]){
                for (i = 0; i < len; i += 1) {
                    if (tweet_data[i][j]) {
                        (j in temp) ? temp[j].push(tweet_data[i][j]) : (temp[j]=[]);
                    } 
                }
            }

            len = temp['created_at'].length;
            temp.month = {};
            for(i=0;i<len;i+=1){
                cache = temp['created_at'][i].substring(4,7);
                (!temp.month[cache]) ? ((useful_data.push({'month' : cache, 'tweets' : []})) && (temp.month[cache] = '1')) : '';                                   
            }
            delete temp.month;


            keys = Object.keys(temp);
            for(i=0;i<len;i++){
                for(j=0;j<useful_data.length;j++){
                    if(temp['created_at'][i].substring(4,7) === useful_data[j].month){
                        for(k=0;k<keys.length;k+=1){
                            obj[keys[k]] = temp[keys[k]][i];
                        }
                        // console.log(obj.text);
                        probability.push(calculate().calculateProbability(calculate().pesimist_optimistic_check(obj['text'])));
                        radius.push(obj.favorite_count);
                        // console.log(probability[count_tweet]);
                        useful_data[j]['tweets'].push(obj);
                    }
                }
            }
            delete temp;
            return useful_data;
        }

            
        return {
            ScreenDimension: function(){
                return {
                    'width' : 0.9*screen.width,
                    'height' : 0.89*screen.height  
                }
            },
            parsedData: function(){
                return parseData();
            },
            drawingInfo : function(position){
                return {
                    'yCoordinate' : probability[position]/*,
                    'radius' : (radius[position]/100)*/
                }
            }            
        }
    }
    
    function calculate(){
        return {
            calculateCordinate : '',
            numberOfMonths : '',
            calculateRadius: '',
            calculateProbability: function(count){
                // console.log(count.positive_count, count.negative_count);
                return ((count.positive_count - count.negative_count)/(count.total_count))*100;
            },
            pesimist_optimistic_check : function(str){
                var str_arr = str.toLowerCase().replace(/[^a-zA-Z ]/g, "").split(' '),
                positive_count = 0,
                negative_count = 0;

                for(i=0;i<str_arr.length;i++){
                    if(positive_words.indexOf(str_arr[i]) > -1){
                        positive_count++;
                        // console.log(str_arr[i]);
                    }
                    if(negative_words.indexOf(str_arr[i]) > -1){
                        negative_count++;
                        // console.log(str_arr[i]);
                    }
                } 
                return {
                    'positive_count' : positive_count,
                    'negative_count' : negative_count,
                    'total_count' : str_arr.length
                }
            }       
        }
    }           

}