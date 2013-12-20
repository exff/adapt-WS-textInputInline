/*
* adapt-contrib-textInput
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Kev Adsett <kev.adsett@gmail.com>
*/

define(function (require) {
    var QuestionView = require('coreViews/questionView');
    var Adapt = require('coreJS/adapt');
    
    var TextInput = QuestionView.extend({
        canSubmit:function() {
            this.$(".textbox").each(function() {
                if($(this).val()=="") {
                    return false;  
                }
            });
            return true;
        },
        
        checkAnswerIsCorrect: function(possibleAnswers, userAnswer) {
            var answerIsCorrect = _.contains(possibleAnswers, this.cleanupUserAnswer(userAnswer));
            if(answerIsCorrect) this.model.set('_hasAtLeastOneCorrectSelection', true);
            return answerIsCorrect;
        },
        
        cleanupUserAnswer: function(userAnswer) {
            if(this.model.get('_allowsAnyCase')) {
                userAnswer = userAnswer.toLowerCase();
            }
            if(this.model.get('_allowsPunctuation')) {
                var userAnswerClean = userAnswer.replace(/[\.,-\/#!$£%\^&\*;:{}=\-_`~()]/g,"");
                userAnswer = $.trim(userAnswerClean);
            }
            return userAnswer;
        },
        
        forEachAnswer: function(callback) {
             _.each(this.model.get('_items'), function(item, index) {
                if(this.model.get('_allowsAnyOrder')) {
                    this.$(".textbox").each($.proxy(function(index, element) {
                        var userAnswer = $(element).val();
                        callback(this.checkAnswerIsCorrect(item.answers, userAnswer), item);
                    },this));
                } else {
                    var userAnswer = this.$(".textbox").eq(index).val();
                    callback(this.checkAnswerIsCorrect(item.answers, userAnswer), item);
                }
            }, this);
        },
        
        markQuestion: function() {
            this.forEachAnswer(function(correct, item) {
                item.correct = correct;
            });
            QuestionView.prototype.markQuestion.apply(this);
        },
        
        onEnabledChanged: function() {
            this.$('.textbox').prop('disabled', !this.model.get('_isEnabled'));
        },
        
        onModelAnswerShown:function () {
            _.each(this.model.get('_items'), function(item, index){
                this.$(".textbox").eq(index).val(item.answers[0]);
            }, this);
        },
        
        onUserAnswerShown:function () {
            _.each(this.model.get('_items'), function(item, index){
                this.$(".textbox").eq(index).val(item.userAnswer);
            }, this);
        },
        
        postRender: function() {
            QuestionView.prototype.postRender.apply(this);
            this.setReadyStatus();
        },
        
        storeUserAnswer: function() {
            _.each(this.model.get('_items'), function(item, index) {
                item.userAnswer = this.$('.textbox').eq(index).val();
            }, this);
        }
        
    });
    
    Adapt.register("textinput", TextInput);
    
});