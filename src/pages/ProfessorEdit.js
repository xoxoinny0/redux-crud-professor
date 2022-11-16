import React, { memo, useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getItem, getCurrentData, putItem } from "../slice/ProfessorSlice";

import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";
import TableEx from "../components/TableEx";

import dayjs from "dayjs";

const ProfessorEdit = memo(() => {
  /** path 파라미터 받기 */
  const { id } = useParams();

  /** 리덕스 관련 초기화 */
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.ProfessorSlice
  );

  /** 데이터 가져오기 */
  useEffect(() => {
    dispatch(getCurrentData());
  }, []);

  /** data값의 변경에 따른 사이드 이펙트 처리 */
  const item = useMemo(() => {
    if (data) {
      return data.find((v, i) => v.id == id);
    } else {
      // 새로 고침 시 현재 데이터만 다시 로드함
      dispatch(getItem({ id: id }));
    }
  }, [data]);

  /** 페이지 강제 이동을 처리하기 위한 navigate 함수 생성 */
  const navigate = useNavigate();

  /** <form>의 submit 버튼이 눌러졌을 때 호출될 이벤트 핸들러 */
  const onProfessorSubmit = useCallback((e) => {
    e.preventDefault();

    // 이벤트가 발생한 폼 객체
    const current = e.currentTarget;

    // 리덕스를 통한 데이터 저장 요청
    dispatch(putItem({
        id: current.id.value,
        name: current.name.value,
        userid: current.userid.value,
        position: current.position.value,
        sal: current.sal.value,
        hiredate: current.hiredate.value,
        comm: current.comm.value,
        deptno: current.deptno.value,
    })).then((result) => {
        console.log(result);

        // 처리가 완료된 후 상세 페이지로 이동
        navigate(`/professor_view/${result.payload.id}`);
    })
  },[]);

  return (
    <div>
      {/* 로딩바 */}
      <Spinner loading={loading} />

      {error ? (
        <ErrorView error={error} />
      ) : (
        <form onSubmit={onProfessorSubmit}>
          <input type="hidden" name="id" defaultValue={item?.id} />
          <TableEx>
            <colgroup>
              <col width="120" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th>이름</th>
                <td className="inputWrapper">
                  <input className="field" type="text" name="name" defaultValue={item?.name} />
                </td>
              </tr>
              <tr>
                <th>아이디</th>
                <td className="inputWrapper">
                  <input className="field" type="text" name="userid" defaultValue={item?.userid}/>
                </td>
              </tr>
              <tr>
                <th>직급</th>
                <td className="inputWrapper">
                  <input className="field" type="text" name="position" defaultValue={item?.position} />
                </td>
              </tr>
              <tr>
                <th>급여</th>
                <td className="inputWrapper">
                  <input className="field" type="text" name="sal" defaultValue={item?.sal}/>
                </td>
              </tr>
              <tr>
                <th>입사일</th>
                <td className="inputWrapper">
                  <input className="field" type="date" name="hiredate" defaultValue={dayjs(item?.hiredate).format('YY-MM-DD')} />
                </td>
              </tr>
              <tr>
                <th>보직수당</th>
                <td className="inputWrapper">
                  <input className="field" type="text" name="comm" defaultValue={item?.comm}/>
                </td>
              </tr>
              <tr>
                <th>학과번호</th>
                <td className="inputWrapper">
                  <input className="field" type="text" name="deptno" defaultValue={item?.deptno}/>
                </td>
              </tr>
            </tbody>
          </TableEx>

          <div style={{ textAlign: "center" }}>
            <button type="submit">저장하기</button>
          </div>
        </form>
      )}
    </div>
  );
});

export default ProfessorEdit;
