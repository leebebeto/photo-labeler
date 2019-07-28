import pandas as pd
import numpy as np
import pickle 
total_data = pd.read_csv('../ffhq597_celeba_attr_predictions.csv')
temp_data = pd.DataFrame(data = np.zeros((total_data.shape[0], total_data.shape[1])), columns = total_data.columns)
temp_data.drop(columns=['filename'])
temp_data['filename']= total_data['filename']
temp_data = total_data[total_data > 0]
data_list = list(temp_data.iloc[0].dropna(axis=0).index)
result_list = {}
for i in range(temp_data.shape[0]):
	data_list = list(temp_data.iloc[i].dropna(axis=0).index)
	result_list[temp_data.loc[i,'filename']] = data_list[:len(data_list)-1]
with open('../attr_list.pickle', 'wb') as f:
	pickle.dump(result_list, f)
print(result_list)