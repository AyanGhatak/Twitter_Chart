 var probability=[],
        tweet_texts =[],
        count_tweet =0,
        likelyWords = {'positive': [],
            'negative':[]};
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
                        probability.push(calculate().calculateProbability(calculate().pesimist_optimistic_check(obj['text'],positive_words,negative_words)));
                        tweet_texts.push(obj.text);
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
                    'yCoordinate' : probability[position],
                    'tweet' : tweet_texts[position]
                }
            },
            updateData : function(list){
                list = calculate().updateData(list);
                probability = [];
                tweet_texts = [];
                for(var i=0;i<list[0].length;i++){
                    probability.push(0.75*calculate().calculateProbability(calculate().pesimist_optimistic_check(list[0][i].text, likelyWords.positive, likelyWords.negative)));
                    tweet_texts.push(list[0][i].text);
                }
                return list;
            }  

        }
    }
    
    function calculate(){

        function generateLikelyWordList(capitalWords, nature){
            var i;
            for(i =0; i<capitalWords.length;i++){
                (nature === 'Positive') ? likelyWords.positive.push(capitalWords[i]) : likelyWords.negative.push(capitalWords[i]); 
            }                 
        } 
        return {
            calculateProbability: function(count){
                return ((count.positive_count - count.negative_count)/(count.total_count))*100;
            },

            pesimist_optimistic_check : function(str, positive_words, negative_words){

                var str_arr = str.replace(/[^a-zA-Z ]/g, "").split(' '),
                positive_count = 0,
                negative_count = 0,
                flag=0,
                nature,
                capitalWords=[];

                for(i=0;i<str_arr.length;i++){
                    if(str_arr[i].match(/^[A-Z]/) && i!=0){
                        capitalWords.push(str_arr[i].toLowerCase());
                    }
                    if(positive_words.indexOf(str_arr[i].toLowerCase()) > -1){
                        flag=1;
                        positive_count++;
                    }
                    if(negative_words.indexOf(str_arr[i].toLowerCase()) > -1){
                        flag=1;
                        negative_count++;
                    }
                }
                if(flag === 1){
                    nature = (positive_count > negative_count)? 'Positive':'Negative';
                    generateLikelyWordList(capitalWords,nature);
                } 
                return {
                    'positive_count' : positive_count,
                    'negative_count' : negative_count,
                    'total_count' : str_arr.length
                }
            },

            updateData : function(list){
                var new_list=[];
                for(i=0;i<list[0].length;i+=1){
                    if(list[0][i].y === 0){
                        new_list.push(list[0][i]);
                    }
                }
                list[0] = new_list;
                return list;
            }                 
        }
    }           

}