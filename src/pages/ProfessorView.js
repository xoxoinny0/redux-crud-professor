import React, { memo, useEffect, useMemo, useCallback } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentData, getItem, deleteItem } from '../slice/ProfessorSlice';

import Spinner from '../components/Spinner';
import ErrorView from '../components/ErrorView';
import Table from '../components/Table';

import dayjs from 'dayjs';

const ProfessorView = memo(() => {
    /** path 파라미터 받기 */
    const { id } = useParams();

    /** 리덕스 관련 초기화 */
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.ProfessorSlice);

    /** 데이터 가져오기 */
    useEffect(() => {
        dispatch(getCurrentData());
    },[]);

    console.log(data);
    
    /** data값의 변경에 따른 사이드 이펙트 처리 */
    const item = useMemo(() => {
        if(data) {
            return data.find((v, i) => v.id == id);
        } else {
            // 새로고침 시 현재 데이터만 다시 로드함
            dispatch(getItem({id : id}));
        }
    },[data]);

    /** 페이지 강제 이동 처리를 위한 navigate 함수 설정 */
    const navigate = useNavigate();
    
    /** 삭제 버튼에 대한 이벤트 리스너 */
    const onProfessorItemDelete = useCallback((e) => {
        e.preventDefault();

        const current = e.target;
        const { id, name, userid, position, sal, hiredate, comm, deptno} = current.dataset;

        if (window.confirm(`정말 ${name}을 삭제하겠습니까?`)) {
            dispatch(deleteItem({
                id: id
            })).then(({ meta, payload }) => {
                // 삭제 후 목록 페이지로 강제이동
                navigate('/');
            });
        }
    },[]);


    console.log(item);

    /** 테이블 생성을 위한 데이터 JSON 배열 */
    // const profList = [
    //     {title : 'No.', data: 'id'},
    //     {title : '이름', data: 'name'},
    //     {title : '아이디', data: 'userid'},
    //     {title : '직급', data: 'position'},
    //     {title : '급여', data: 'sal'},
    //     {title : '입사일', data: 'hiredate'},
    //     {title : '보직수당', data: 'comm'},
    //     {title : '학과번호', data: 'deptno'},
    // ];

  return (
    <div>
        {/* 로딩바 */}
        <Spinner loading={loading} />

        {error? (
            <ErrorView error={error} /> 
        ) : (
            // id값과 일치하는 데이터가 있다면
            item && (
                <div>
                    <Table>
                        <colgroup>
                            <col width='120' />
                            <col />
                        </colgroup>
                        <tbody>
                            {/* {profList.map((v, i) => {
                                return (
                                    <tr key={i}>
                                    <th>{v.title}</th>
                                    <td>{item[v.data]}</td>
                                </tr>
                                )
                            })} */}
                            <tr>
                                <th>No.</th>
                                <td>{item.id}</td>
                            </tr>
                            <tr>
                                <th>이름</th>
                                <td>{item.name}</td>
                            </tr>
                            <tr>
                                <th>아이디</th>
                                <td>{item.userid}</td>
                            </tr>
                            <tr>
                                <th>직급</th>
                                <td>{item.position}</td>
                            </tr>
                            <tr>
                                <th>급여</th>
                                <td>{item.sal}만원</td>
                            </tr>
                            <tr>
                                <th>입사일</th>
                                <td>{dayjs(item.hiredate).format('YY-MM-DD')}</td>
                            </tr>
                            <tr>
                                <th>보직수당</th>
                                <td>{item.comm}만원</td>
                            </tr>
                            <tr>
                                <th>학과번호</th>
                                <td>{item.deptno}</td>
                            </tr>

                        </tbody>
                    </Table>

                    <div style={{ textAlign: 'center ', padding: '10px', backgroundColor: '#f0f6f9'}}>
                        <NavLink to='/'>목록</NavLink>
                        &nbsp; | &nbsp;
                        <NavLink to='/professor_add'>등록</NavLink>
                        &nbsp; | &nbsp;
                        <NavLink to={`/professor_edit/${item.id}`}>수정</NavLink>
                        &nbsp; | &nbsp;
                        <NavLink to='#!' onClick={onProfessorItemDelete} data-id={item.id} data-name={item.name} data-userid={item.userid} data-position={item.position} data-sal={item.sal} data-hiredate={item.hiredate} data-comm={item.comm} data-deptno={item.deptno} >삭제</NavLink>
                    </div>
                </div>
            )
        )}
    </div>
  );
});

export default ProfessorView;