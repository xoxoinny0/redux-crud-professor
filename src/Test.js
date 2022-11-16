import React, { memo, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { getList, getItem, postItem, putItem, deleteItem } from './slice/ProfessorSlice';

const Test = memo(() => {
    const dispatch = useDispatch();
    const { data, loading, error} = useSelector((state) => state.ProfessorSlice);

    useEffect(() => {
        dispatch(getList());
        
        // dispatch(getItem({id : 9901}));

        // dispatch(postItem({name: 'test2', userid: 'test'}));

        // dispatch(putItem({id: 9911, name: '수정test', userid: 'test'}));

        // dispatch(deleteItem({id: 9910}));
    }, [dispatch]);

    console.log(data);
    console.log(loading)
    return (
        
        loading ? "loading..." : (
            error ? JSON.stringify(error) : (
                <>
                    {JSON.stringify(data)}
                </>
            )
        )
    )
});

export default Test;